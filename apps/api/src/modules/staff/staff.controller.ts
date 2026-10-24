import { Controller, Post, Get, Put, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import {
  CreateStaffDto,
  SetWorkingHoursDto,
  CreateScheduleExceptionDto,
  WorkspaceRole,
} from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Post()
  async create(@Headers('x-workspace-id') workspaceId: string, @Body() dto: CreateStaffDto) {
    return this.staffService.create(workspaceId, dto);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get()
  async list(@Headers('x-workspace-id') workspaceId: string) {
    return this.staffService.list(workspaceId);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get(':id')
  async getById(@Headers('x-workspace-id') workspaceId: string, @Param('id') id: string) {
    return this.staffService.getById(workspaceId, id);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF)
  @Put(':id/working-hours')
  async setWorkingHours(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() dto: SetWorkingHoursDto,
  ) {
    return this.staffService.setWorkingHours(workspaceId, id, dto);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF)
  @Post(':id/exceptions')
  async addException(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() dto: CreateScheduleExceptionDto,
  ) {
    return this.staffService.addException(workspaceId, id, dto);
  }
}
