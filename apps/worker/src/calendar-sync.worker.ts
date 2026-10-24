import { prisma } from '@slotsync/database';

export async function processCalendarSync() {
  const connections = await prisma.calendarConnection.findMany({
    where: { isActive: true },
    include: { staff: true },
  });

  if (connections.length === 0) {
    return 0;
  }

  for (const conn of connections) {
    try {
      // Periodic sync heartbeat
      await prisma.calendarConnection.update({
        where: { id: conn.id },
        data: { lastSyncedAt: new Date() },
      });
    } catch (err: any) {
      console.error(`[CalendarSyncWorker] Failed syncing connection ${conn.id}:`, err.message);
    }
  }

  return connections.length;
}
