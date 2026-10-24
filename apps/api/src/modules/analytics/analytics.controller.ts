import { Controller, Get, Query, Headers, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { WorkspaceRole } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Get('summary')
  async getSummary(
    @Headers('x-workspace-id') workspaceId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.analyticsService.getSummary(workspaceId, start, end);
  }
}
