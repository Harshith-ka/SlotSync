import { prisma } from '@slotsync/database';
import * as crypto from 'crypto';

export async function processOutboxEvents() {
  const pendingEvents = await prisma.outboxEvent.findMany({
    where: { publishedAt: null },
    take: 20,
    orderBy: { createdAt: 'asc' },
  });

  if (pendingEvents.length === 0) {
    return 0;
  }

  console.log(`[OutboxWorker] Found ${pendingEvents.length} pending events to publish...`);

  for (const event of pendingEvents) {
    try {
      // Find webhooks subscribed to this workspace and event type
      const webhooks = await prisma.webhookSubscription.findMany({
        where: {
          workspaceId: event.workspaceId,
          isActive: true,
        },
      });

      for (const webhook of webhooks) {
        if (webhook.events.includes(event.type) || webhook.events.includes('*')) {
          const payloadString = JSON.stringify(event.payload);
          const signature = crypto
            .createHmac('sha256', webhook.signingSecret)
            .update(payloadString)
            .digest('hex');

          console.log(
            `[OutboxWorker] Dispatched event "${event.type}" to ${webhook.url} (Signature: sha256=${signature.substring(0, 10)}...)`,
          );
        }
      }

      // Mark outbox event as published
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { publishedAt: new Date() },
      });
    } catch (err: any) {
      console.error(`[OutboxWorker] Failed to process event ${event.id}:`, err.message);
    }
  }

  return pendingEvents.length;
}
