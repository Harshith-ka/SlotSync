import { prisma, HoldStatus, BookingStatus, AllocationStatus } from '@slotsync/database';

export async function processHoldExpirations() {
  const now = new Date();

  // Find all holds that are ACTIVE but have passed expiresAt
  const expiredHolds = await prisma.bookingHold.findMany({
    where: {
      status: HoldStatus.ACTIVE,
      expiresAt: { lt: now },
    },
    include: { booking: true },
    take: 50,
  });

  if (expiredHolds.length === 0) {
    return 0;
  }

  console.log(`[HoldExpiryWorker] Processing ${expiredHolds.length} expired reservation holds...`);

  for (const hold of expiredHolds) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.bookingHold.update({
          where: { id: hold.id },
          data: { status: HoldStatus.EXPIRED },
        });

        if (hold.booking.status === BookingStatus.HELD) {
          await tx.booking.update({
            where: { id: hold.bookingId },
            data: { status: BookingStatus.EXPIRED },
          });

          await tx.reservationAllocation.updateMany({
            where: {
              bookingId: hold.bookingId,
              status: AllocationStatus.HELD,
            },
            data: { status: AllocationStatus.RELEASED },
          });

          await tx.bookingEvent.create({
            data: {
              bookingId: hold.bookingId,
              eventType: 'HOLD_EXPIRED',
              metadata: { expiredAt: now },
            },
          });
        }
      });
      console.log(`[HoldExpiryWorker] Cleaned expired hold ${hold.id} for booking ${hold.bookingId}`);
    } catch (err: any) {
      console.error(`[HoldExpiryWorker] Error cleaning hold ${hold.id}:`, err.message);
    }
  }

  return expiredHolds.length;
}
