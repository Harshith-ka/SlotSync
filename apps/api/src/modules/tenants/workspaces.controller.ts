import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(userId, dto);
  }

  @Get()
  async listForUser(@CurrentUser('id') userId: string) {
    return this.workspacesService.listForUser(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.workspacesService.getById(id);
  }
}
