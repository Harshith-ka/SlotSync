import { Controller, Post, Get, Param, Body, Headers, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateHoldDto, ConfirmBookingDto, WorkspaceRole } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // -------------------------------------------------------------
  // PUBLIC BOOKING ENDPOINTS
  // -------------------------------------------------------------

  @Post('public/:slug/holds')
  async createHold(
    @Param('slug') slug: string,
    @Body() dto: CreateHoldDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.bookingsService.createHold(slug, dto, idempotencyKey);
  }

  @Post('public/:slug/bookings/confirm')
  async confirmBooking(
    @Param('slug') slug: string,
    @Body() dto: ConfirmBookingDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.bookingsService.confirmBooking(slug, dto, idempotencyKey);
  }

  @Get('public/:slug/bookings/:id')
  async getBooking(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Query('token') token: string,
  ) {
    return this.bookingsService.getBooking(slug, id, token);
  }

  @Post('public/:slug/bookings/:id/cancel')
  async cancelBooking(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Query('token') token: string,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.cancelBooking(slug, id, token, reason);
  }

  // -------------------------------------------------------------
  // DASHBOARD INTERNAL ENDPOINTS
  // -------------------------------------------------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get('bookings')
  async listWorkspaceBookings(
    @Headers('x-workspace-id') workspaceId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.bookingsService.listWorkspaceBookings(workspaceId, locationId);
  }
}
