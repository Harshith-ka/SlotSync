import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CreateCheckoutSessionDto,
  PaymentWebhookPayload,
  WorkspaceRole,
} from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session/:slug')
  async createCheckoutSession(
    @Param('slug') slug: string,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.paymentsService.createCheckoutSession(slug, dto);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: PaymentWebhookPayload,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(payload);
    return this.paymentsService.handleWebhook(signature || '', rawBody, payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Post(':id/refund')
  async refund(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') paymentId: string,
    @Body('reason') reason?: string,
  ) {
    return this.paymentsService.processRefund(workspaceId, paymentId, reason);
  }
}
