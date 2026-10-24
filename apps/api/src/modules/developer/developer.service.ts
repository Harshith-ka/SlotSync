import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateApiKeyDto,
  ApiKeyResponse,
  CreateWebhookDto,
  WebhookResponse,
} from '@slotsync/shared-types';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  constructor(private prisma: PrismaService) {}

  // -------------------------------------------------------------
  // API KEYS
  // -------------------------------------------------------------

  async createApiKey(workspaceId: string, dto: CreateApiKeyDto): Promise<ApiKeyResponse> {
    const rawSecret = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
    const prefix = rawSecret.substring(0, 15);
    const keyHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    const record = await this.prisma.apiKey.create({
      data: {
        workspaceId,
        name: dto.name,
        prefix,
        keyHash,
        scopes: dto.scopes || ['read', 'write'],
      },
    });

    return {
      id: record.id,
      name: record.name,
      prefix: record.prefix,
      secretKey: rawSecret, // Returned strictly once!
      createdAt: record.createdAt.toISOString(),
    };
  }

  async listApiKeys(workspaceId: string): Promise<ApiKeyResponse[]> {
    const keys = await this.prisma.apiKey.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return keys.map((k) => ({
      id: k.id,
      name: k.name,
      prefix: k.prefix,
      createdAt: k.createdAt.toISOString(),
    }));
  }

  async deleteApiKey(workspaceId: string, keyId: string) {
    const key = await this.prisma.apiKey.findFirst({
      where: { id: keyId, workspaceId },
    });

    if (!key) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'API Key not found.',
      });
    }

    return this.prisma.apiKey.delete({ where: { id: keyId } });
  }

  // -------------------------------------------------------------
  // WEBHOOKS
  // -------------------------------------------------------------

  async createWebhook(workspaceId: string, dto: CreateWebhookDto): Promise<WebhookResponse> {
    const signingSecret = `whsec_${crypto.randomBytes(20).toString('hex')}`;

    const webhook = await this.prisma.webhookSubscription.create({
      data: {
        workspaceId,
        url: dto.url,
        events: dto.events || ['booking.confirmed', 'booking.cancelled', 'hold.created'],
        signingSecret,
        isActive: true,
      },
    });

    return {
      id: webhook.id,
      url: webhook.url,
      events: webhook.events,
      signingSecret: webhook.signingSecret,
      isActive: webhook.isActive,
      createdAt: webhook.createdAt.toISOString(),
    };
  }

  async listWebhooks(workspaceId: string): Promise<WebhookResponse[]> {
    const webhooks = await this.prisma.webhookSubscription.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return webhooks.map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      signingSecret: w.signingSecret,
      isActive: w.isActive,
      createdAt: w.createdAt.toISOString(),
    }));
  }

  async deleteWebhook(workspaceId: string, webhookId: string) {
    const webhook = await this.prisma.webhookSubscription.findFirst({
      where: { id: webhookId, workspaceId },
    });

    if (!webhook) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Webhook subscription not found.',
      });
    }

    return this.prisma.webhookSubscription.delete({ where: { id: webhookId } });
  }
}
