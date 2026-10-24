import { Controller, Post, Get, Patch, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, WorkspaceRole } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Post()
  async create(@Headers('x-workspace-id') workspaceId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(workspaceId, dto);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get()
  async list(@Headers('x-workspace-id') workspaceId: string) {
    return this.servicesService.list(workspaceId);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER, WorkspaceRole.STAFF, WorkspaceRole.RECEPTIONIST)
  @Get(':id')
  async getById(@Headers('x-workspace-id') workspaceId: string, @Param('id') id: string) {
    return this.servicesService.getById(workspaceId, id);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Patch(':id')
  async update(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(workspaceId, id, dto);
  }
}
