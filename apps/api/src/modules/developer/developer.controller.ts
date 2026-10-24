import { Controller, Post, Get, Delete, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateApiKeyDto, CreateWebhookDto, WorkspaceRole } from '@slotsync/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Roles(WorkspaceRole.OWNER)
  @Post('api-keys')
  async createApiKey(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.developerService.createApiKey(workspaceId, dto);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Get('api-keys')
  async listApiKeys(@Headers('x-workspace-id') workspaceId: string) {
    return this.developerService.listApiKeys(workspaceId);
  }

  @Roles(WorkspaceRole.OWNER)
  @Delete('api-keys/:id')
  async deleteApiKey(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') keyId: string,
  ) {
    return this.developerService.deleteApiKey(workspaceId, keyId);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Post('webhooks')
  async createWebhook(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() dto: CreateWebhookDto,
  ) {
    return this.developerService.createWebhook(workspaceId, dto);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Get('webhooks')
  async listWebhooks(@Headers('x-workspace-id') workspaceId: string) {
    return this.developerService.listWebhooks(workspaceId);
  }

  @Roles(WorkspaceRole.OWNER, WorkspaceRole.MANAGER)
  @Delete('webhooks/:id')
  async deleteWebhook(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('id') webhookId: string,
  ) {
    return this.developerService.deleteWebhook(workspaceId, webhookId);
  }
}
