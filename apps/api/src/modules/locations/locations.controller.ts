import { Controller, Post, Get, Patch, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto, WorkspaceRole } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Post()
  async create(@Headers('x-workspace-id') workspaceId: string, @Body() dto: CreateLocationDto) {
    return this.locationsService.create(workspaceId, dto);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get()
  async list(@Headers('x-workspace-id') workspaceId: string) {
    return this.locationsService.list(workspaceId);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get(':id')
  async getById(@Headers('x-workspace-id') workspaceId: string, @Param('id') id: string) {
    return this.locationsService.getById(workspaceId, id);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Patch(':id')
  async update(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(workspaceId, id, dto);
  }
}
