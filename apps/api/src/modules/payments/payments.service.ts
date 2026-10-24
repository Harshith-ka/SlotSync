import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  BookingStatus,
  HoldStatus,
  AllocationStatus,
  PaymentStatus,
  PaymentProvider,
  CreateCheckoutSessionDto,
  CheckoutSessionResponse,
  PaymentWebhookPayload,
} from '@slotsync/shared-types';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(
    workspaceSlug: string,
    dto: CreateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponse> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    const booking = await this.prisma.booking.findFirst({
      where: { id: dto.bookingId, workspaceId: workspace.id },
      include: {
        holds: true,
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Booking not found.',
      });
    }

    const activeHold = booking.holds.find(
      (h) => h.token === dto.bookingToken && h.status === HoldStatus.ACTIVE,
    );

    if (!activeHold) {
      throw new ConflictException({
        code: 'HOLD_EXPIRED',
        message: 'The temporary hold has expired or is invalid.',
      });
    }

    if (new Date() > activeHold.expiresAt) {
      throw new ConflictException({
        code: 'HOLD_EXPIRED',
        message: 'The temporary reservation hold has expired.',
      });
    }

    const providerSessionId = `cs_test_${uuidv4().replace(/-/g, '')}`;

    // Create Payment record in PENDING status
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: PaymentProvider.STRIPE,
        providerPaymentId: providerSessionId,
        amountMinor: booking.totalMinor,
        currency: booking.currency,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      sessionId: providerSessionId,
      checkoutUrl: `${dto.returnUrl}?session_id=${providerSessionId}&booking_id=${booking.id}`,
      amountMinor: booking.totalMinor,
      currency: booking.currency,
    };
  }

  async handleWebhook(
    signature: string,
    rawPayload: string,
    payload: PaymentWebhookPayload,
  ) {
    // 1. Idempotency Check for Webhook Event
    const eventId = payload.id || `evt_${uuidv4()}`;
    const existingPayment = await this.prisma.payment.findUnique({
      where: { providerPaymentId: payload.data.providerPaymentId },
      include: {
        booking: {
          include: {
            holds: true,
            allocations: true,
          },
        },
      },
    });

    if (!existingPayment) {
      this.logger.warn(`Received webhook for unknown payment: ${payload.data.providerPaymentId}`);
      return { received: true };
    }

    if (existingPayment.status === PaymentStatus.SUCCEEDED) {
      // Already processed idempotently
      return { received: true, message: 'Already processed' };
    }

    const booking = existingPayment.booking;

    // 2. Transactional Reconciliation & Booking Finalization
    return this.prisma.$transaction(async (tx) => {
      if (payload.data.status === 'succeeded') {
        const activeHold = booking.holds.find(
          (h) => h.status === HoldStatus.ACTIVE && h.expiresAt > new Date(),
        );

        if (!activeHold) {
          // CRITICAL EDGE CASE from PRD Section 10.2:
          // Payment succeeded after hold expired!
          // Mark as PAYMENT_REVIEW and reconciliation required rather than double booking!
          this.logger.warn(
            `Late payment detected for booking ${booking.id}. Moving to PAYMENT_REVIEW.`,
          );

          await tx.payment.update({
            where: { id: existingPayment.id },
            data: { status: PaymentStatus.SUCCEEDED },
          });

          await tx.booking.update({
            where: { id: booking.id },
            data: { status: BookingStatus.PAYMENT_REVIEW },
          });

          await tx.bookingEvent.create({
            data: {
              bookingId: booking.id,
              eventType: 'PAYMENT_SUCCEEDED_AFTER_HOLD_EXPIRED',
              metadata: {
                paymentId: existingPayment.id,
                actionNeeded: 'RECONCILIATION_OR_REFUND',
              },
            },
          });

          return { received: true, status: 'PAYMENT_REVIEW' };
        }

        // Happy Path: Hold is valid, confirm booking & allocations
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: { status: PaymentStatus.SUCCEEDED },
        });

        await tx.bookingHold.update({
          where: { id: activeHold.id },
          data: { status: HoldStatus.CONVERTED },
        });

        await tx.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.CONFIRMED },
        });

        await tx.reservationAllocation.updateMany({
          where: { bookingId: booking.id },
          data: { status: AllocationStatus.CONFIRMED },
        });

        await tx.bookingEvent.create({
          data: {
            bookingId: booking.id,
            eventType: 'PAYMENT_CONFIRMED',
            metadata: {
              paymentId: existingPayment.id,
              amountMinor: existingPayment.amountMinor,
            },
          },
        });

        // Trigger Outbox Notification
        await tx.outboxEvent.create({
          data: {
            workspaceId: booking.workspaceId,
            type: 'booking.payment_confirmed',
            payload: {
              bookingId: booking.id,
              amountMinor: existingPayment.amountMinor,
              currency: existingPayment.currency,
            },
          },
        });

        return { received: true, status: 'CONFIRMED' };
      } else {
        // Payment failed
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: { status: PaymentStatus.FAILED },
        });

        await tx.bookingEvent.create({
          data: {
            bookingId: booking.id,
            eventType: 'PAYMENT_FAILED',
            metadata: { paymentId: existingPayment.id },
          },
        });

        return { received: true, status: 'FAILED' };
      }
    });
  }

  async processRefund(workspaceId: string, paymentId: string, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment || payment.booking.workspaceId !== workspaceId) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Payment not found in this workspace.',
      });
    }

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException({
        code: 'INVALID_REFUND_STATUS',
        message: 'Only succeeded payments can be refunded.',
      });
    }

    const providerRefundId = `re_test_${uuidv4().replace(/-/g, '')}`;

    return this.prisma.$transaction(async (tx) => {
      const refund = await tx.refund.create({
        data: {
          paymentId: payment.id,
          providerRefundId,
          amountMinor: payment.amountMinor,
          currency: payment.currency,
          status: PaymentStatus.SUCCEEDED,
        },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.REFUNDED },
      });

      await tx.bookingEvent.create({
        data: {
          bookingId: payment.bookingId,
          eventType: 'PAYMENT_REFUNDED',
          metadata: { refundId: refund.id, reason },
        },
      });

      return refund;
    });
  }
}
