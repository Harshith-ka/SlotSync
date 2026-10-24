import {
  Injectable,
  ConflictException,
  NotFoundException,
  GoneException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateHoldDto,
  HoldResponse,
  ConfirmBookingDto,
  BookingResponse,
  BookingStatus,
  HoldStatus,
  AllocationStatus,
} from '@slotsync/shared-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createHold(
    workspaceSlug: string,
    dto: CreateHoldDto,
    idempotencyKey?: string,
  ): Promise<HoldResponse> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existingIdempotency = await this.prisma.idempotencyRecord.findUnique({
        where: {
          workspaceId_operation_key: {
            workspaceId: workspace.id,
            operation: 'CREATE_HOLD',
            key: idempotencyKey,
          },
        },
      });

      if (existingIdempotency && existingIdempotency.status === 'COMPLETED' && existingIdempotency.response) {
        return existingIdempotency.response as unknown as HoldResponse;
      }
    }

    const service = await this.prisma.service.findFirst({
      where: { id: dto.serviceId, workspaceId: workspace.id },
      include: { staffServices: true },
    });

    if (!service) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Service not found.',
      });
    }

    // Determine staff member: specific or any eligible
    let selectedStaffId = dto.staffId;
    if (!selectedStaffId) {
      const firstStaff = service.staffServices[0];
      if (!firstStaff) {
        throw new ConflictException({
          code: 'NO_STAFF_AVAILABLE',
          message: 'No staff available for this service.',
        });
      }
      selectedStaffId = firstStaff.staffId;
    }

    const slotStart = new Date(dto.startsAt);
    const slotEnd = new Date(slotStart.getTime() + service.durationMinutes * 60000);
    const occupancyStart = new Date(slotStart.getTime() - service.bufferBeforeMinutes * 60000);
    const occupancyEnd = new Date(slotEnd.getTime() + service.bufferAfterMinutes * 60000);

    const holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes hold
    const bookingToken = uuidv4();

    // 2. Transactional Hold Creation with Concurrency Control
    const result = await this.prisma.$transaction(async (tx) => {
      // Find or create customer
      let customer = await tx.customer.findUnique({
        where: {
          workspaceId_email: {
            workspaceId: workspace.id,
            email: dto.customer.email.toLowerCase(),
          },
        },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            workspaceId: workspace.id,
            name: dto.customer.name,
            email: dto.customer.email.toLowerCase(),
            phone: dto.customer.phone,
          },
        });
      }

      // Check for conflicting confirmed bookings or active holds
      const conflictingAllocation = await tx.reservationAllocation.findFirst({
        where: {
          resourceId: selectedStaffId,
          startsAt: { lt: occupancyEnd },
          endsAt: { gt: occupancyStart },
          OR: [
            { status: AllocationStatus.CONFIRMED },
            {
              status: AllocationStatus.HELD,
              booking: {
                holds: {
                  some: {
                    status: HoldStatus.ACTIVE,
                    expiresAt: { gt: new Date() },
                  },
                },
              },
            },
          ],
        },
      });

      if (conflictingAllocation) {
        throw new ConflictException({
          code: 'SLOT_UNAVAILABLE',
          message: 'This appointment time was just taken by another customer.',
        });
      }

      // Create Booking in HELD status
      const booking = await tx.booking.create({
        data: {
          workspaceId: workspace.id,
          locationId: dto.locationId,
          serviceId: service.id,
          customerId: customer.id,
          status: BookingStatus.HELD,
          startsAt: slotStart,
          endsAt: slotEnd,
          totalMinor: service.priceMinor,
          currency: service.currency,
        },
      });

      // Create Booking Hold
      const hold = await tx.bookingHold.create({
        data: {
          bookingId: booking.id,
          token: bookingToken,
          status: HoldStatus.ACTIVE,
          expiresAt: holdExpiresAt,
        },
      });

      // Create Reservation Allocation
      await tx.reservationAllocation.create({
        data: {
          bookingId: booking.id,
          resourceId: selectedStaffId,
          status: AllocationStatus.HELD,
          startsAt: occupancyStart,
          endsAt: occupancyEnd,
        },
      });

      // Record Booking Event
      await tx.bookingEvent.create({
        data: {
          bookingId: booking.id,
          eventType: 'HOLD_CREATED',
          metadata: {
            expiresAt: holdExpiresAt,
            staffId: selectedStaffId,
          },
        },
      });

      const response: HoldResponse = {
        holdId: hold.id,
        bookingId: booking.id,
        status: BookingStatus.HELD,
        expiresAt: holdExpiresAt.toISOString(),
        bookingToken,
      };

      // Record Idempotency
      if (idempotencyKey) {
        await tx.idempotencyRecord.create({
          data: {
            workspaceId: workspace.id,
            operation: 'CREATE_HOLD',
            key: idempotencyKey,
            payloadHash: '',
            status: 'COMPLETED',
            response: response as any,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      }

      return response;
    });

    return result;
  }

  async confirmBooking(
    workspaceSlug: string,
    dto: ConfirmBookingDto,
    idempotencyKey?: string,
  ): Promise<BookingResponse> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existingIdempotency = await this.prisma.idempotencyRecord.findUnique({
        where: {
          workspaceId_operation_key: {
            workspaceId: workspace.id,
            operation: 'CONFIRM_BOOKING',
            key: idempotencyKey,
          },
        },
      });

      if (existingIdempotency && existingIdempotency.status === 'COMPLETED' && existingIdempotency.response) {
        return existingIdempotency.response as unknown as BookingResponse;
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { id: dto.bookingId, workspaceId: workspace.id },
        include: {
          holds: true,
          service: true,
          location: true,
          customer: true,
          allocations: true,
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
        throw new UnauthorizedException({
          code: 'INVALID_TOKEN',
          message: 'Invalid booking management token.',
        });
      }

      // Authoritative database clock check
      if (new Date() > activeHold.expiresAt) {
        await tx.bookingHold.update({
          where: { id: activeHold.id },
          data: { status: HoldStatus.EXPIRED },
        });

        await tx.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.EXPIRED },
        });

        throw new GoneException({
          code: 'HOLD_EXPIRED',
          message: 'The temporary hold has expired. Please select a new slot.',
        });
      }

      // Confirm Booking and Convert Hold
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          customerNote: dto.customerNote,
        },
      });

      await tx.bookingHold.update({
        where: { id: activeHold.id },
        data: { status: HoldStatus.CONVERTED },
      });

      // Update allocations to CONFIRMED (enforced by exclusion constraint)
      await tx.reservationAllocation.updateMany({
        where: { bookingId: booking.id },
        data: { status: AllocationStatus.CONFIRMED },
      });

      // Log event
      await tx.bookingEvent.create({
        data: {
          bookingId: booking.id,
          eventType: 'BOOKING_CONFIRMED',
          metadata: { confirmedAt: new Date() },
        },
      });

      const staffAllocation = booking.allocations[0];
      let staffProfile: any = null;
      if (staffAllocation) {
        staffProfile = await tx.staffProfile.findUnique({
          where: { id: staffAllocation.resourceId },
        });
      }

      const response: BookingResponse = {
        id: booking.id,
        status: BookingStatus.CONFIRMED,
        startsAt: booking.startsAt.toISOString(),
        endsAt: booking.endsAt.toISOString(),
        totalMinor: booking.totalMinor,
        currency: booking.currency,
        service: {
          id: booking.service.id,
          name: booking.service.name,
          durationMinutes: booking.service.durationMinutes,
        },
        location: {
          id: booking.location.id,
          name: booking.location.name,
          timezone: booking.location.timezone,
          address: booking.location.address,
        },
        customer: {
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
        },
        staff: staffProfile
          ? {
              id: staffProfile.id,
              displayName: staffProfile.displayName,
            }
          : undefined,
      };

      if (idempotencyKey) {
        await tx.idempotencyRecord.create({
          data: {
            workspaceId: workspace.id,
            operation: 'CONFIRM_BOOKING',
            key: idempotencyKey,
            payloadHash: '',
            status: 'COMPLETED',
            response: response as any,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      }

      return response;
    });
  }

  async getBooking(
    workspaceSlug: string,
    bookingId: string,
    token: string,
  ): Promise<BookingResponse> {
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
      where: { id: bookingId, workspaceId: workspace.id },
      include: {
        holds: true,
        service: true,
        location: true,
        customer: true,
        allocations: true,
      },
    });

    if (!booking) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Booking not found.',
      });
    }

    const hasValidToken = booking.holds.some((h) => h.token === token);
    if (!hasValidToken) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid booking credential.',
      });
    }

    const staffAllocation = booking.allocations[0];
    let staffProfile: any = null;
    if (staffAllocation) {
      staffProfile = await this.prisma.staffProfile.findUnique({
        where: { id: staffAllocation.resourceId },
      });
    }

    return {
      id: booking.id,
      status: booking.status as BookingStatus,
      startsAt: booking.startsAt.toISOString(),
      endsAt: booking.endsAt.toISOString(),
      totalMinor: booking.totalMinor,
      currency: booking.currency,
      service: {
        id: booking.service.id,
        name: booking.service.name,
        durationMinutes: booking.service.durationMinutes,
      },
      location: {
        id: booking.location.id,
        name: booking.location.name,
        timezone: booking.location.timezone,
        address: booking.location.address,
      },
      customer: {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
      },
      staff: staffProfile
        ? {
            id: staffProfile.id,
            displayName: staffProfile.displayName,
          }
        : undefined,
    };
  }

  async cancelBooking(
    workspaceSlug: string,
    bookingId: string,
    token: string,
    reason?: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { id: bookingId, workspaceId: workspace.id },
        include: { holds: true },
      });

      if (!booking) {
        throw new NotFoundException({
          code: 'NOT_FOUND',
          message: 'Booking not found.',
        });
      }

      const hasValidToken = booking.holds.some((h) => h.token === token);
      if (!hasValidToken) {
        throw new UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Invalid booking credential.',
        });
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new ConflictException({
          code: 'BOOKING_ALREADY_CANCELLED',
          message: 'This booking is already cancelled.',
        });
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED },
      });

      await tx.reservationAllocation.updateMany({
        where: { bookingId: booking.id },
        data: { status: AllocationStatus.CANCELLED },
      });

      await tx.bookingEvent.create({
        data: {
          bookingId: booking.id,
          eventType: 'BOOKING_CANCELLED',
          metadata: { reason: reason || 'Customer requested cancellation' },
        },
      });

      return {
        id: booking.id,
        status: BookingStatus.CANCELLED,
        message: 'Booking successfully cancelled. Resources have been released.',
      };
    });
  }

  async listWorkspaceBookings(workspaceId: string, locationId?: string) {
    return this.prisma.booking.findMany({
      where: {
        workspaceId,
        locationId: locationId || undefined,
      },
      include: {
        service: true,
        customer: true,
        location: true,
        allocations: true,
      },
      orderBy: { startsAt: 'desc' },
      take: 50,
    });
  }

  async rescheduleBooking(
    workspaceSlug: string,
    bookingId: string,
    token: string,
    newStartsAt: string,
    newStaffId?: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { id: bookingId, workspaceId: workspace.id },
        include: {
          holds: true,
          service: true,
          allocations: true,
        },
      });

      if (!booking) {
        throw new NotFoundException({
          code: 'NOT_FOUND',
          message: 'Booking not found.',
        });
      }

      const hasValidToken = booking.holds.some((h) => h.token === token);
      if (!hasValidToken) {
        throw new UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Invalid booking credential.',
        });
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new ConflictException({
          code: 'BOOKING_ALREADY_CANCELLED',
          message: 'Cannot reschedule a cancelled booking.',
        });
      }

      const currentStaffAllocation = booking.allocations[0];
      const targetStaffId = newStaffId || currentStaffAllocation?.resourceId;

      if (!targetStaffId) {
        throw new ConflictException({
          code: 'NO_STAFF_ASSIGNED',
          message: 'No staff assigned.',
        });
      }

      const slotStart = new Date(newStartsAt);
      const slotEnd = new Date(slotStart.getTime() + booking.service.durationMinutes * 60000);
      const occupancyStart = new Date(slotStart.getTime() - booking.service.bufferBeforeMinutes * 60000);
      const occupancyEnd = new Date(slotEnd.getTime() + booking.service.bufferAfterMinutes * 60000);

      // Check conflict on new slot
      const conflict = await tx.reservationAllocation.findFirst({
        where: {
          resourceId: targetStaffId,
          bookingId: { not: booking.id },
          startsAt: { lt: occupancyEnd },
          endsAt: { gt: occupancyStart },
          status: { in: [AllocationStatus.CONFIRMED, AllocationStatus.HELD] },
        },
      });

      if (conflict) {
        throw new ConflictException({
          code: 'SLOT_UNAVAILABLE',
          message: 'The requested new slot is not available. Your original appointment has been preserved.',
        });
      }

      // Step 1: Release old allocations
      await tx.reservationAllocation.deleteMany({
        where: { bookingId: booking.id },
      });

      // Step 2: Create new allocation
      await tx.reservationAllocation.create({
        data: {
          bookingId: booking.id,
          resourceId: targetStaffId,
          status: AllocationStatus.CONFIRMED,
          startsAt: occupancyStart,
          endsAt: occupancyEnd,
        },
      });

      // Step 3: Update booking times
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          startsAt: slotStart,
          endsAt: slotEnd,
          status: BookingStatus.CONFIRMED,
        },
      });

      // Step 4: Audit Event
      await tx.bookingEvent.create({
        data: {
          bookingId: booking.id,
          eventType: 'BOOKING_RESCHEDULED',
          metadata: {
            oldStartsAt: booking.startsAt,
            newStartsAt: slotStart,
            staffId: targetStaffId,
          },
        },
      });

      return {
        id: updated.id,
        status: updated.status,
        startsAt: updated.startsAt.toISOString(),
        endsAt: updated.endsAt.toISOString(),
        message: 'Appointment successfully rescheduled.',
      };
    });
  }
}
