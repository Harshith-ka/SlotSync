import { Controller, Get, Param, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityQueryDto } from '@slotsync/shared-types';

@Controller('public/:slug/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Param('slug') slug: string,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.availabilityService.calculateAvailability(slug, query);
  }
}
