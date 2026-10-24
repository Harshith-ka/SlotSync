import { Controller, Post, Get, Delete, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { WorkspaceRole } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF)
  @Get('connections')
  async listConnections(@Headers('x-workspace-id') workspaceId: string) {
    return this.calendarsService.listConnections(workspaceId);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF)
  @Post('connect')
  async connect(
    @Headers('x-workspace-id') workspaceId: string,
    @Body('staffId') staffId: string,
    @Body('provider') provider: 'GOOGLE' | 'OUTLOOK',
  ) {
    return this.calendarsService.connectProvider(workspaceId, staffId, provider);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF)
  @Delete('connections/:id')
  async disconnect(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') connectionId: string,
  ) {
    return this.calendarsService.disconnect(workspaceId, connectionId);
  }
}
