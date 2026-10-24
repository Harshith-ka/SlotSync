import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  AvailabilityQueryDto,
  AvailabilityResponse,
  TimeSlot,
  BookingStatus,
  HoldStatus,
} from '@slotsync/shared-types';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async calculateAvailability(
    workspaceSlug: string,
    query: AvailabilityQueryDto,
  ): Promise<AvailabilityResponse> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    const service = await this.prisma.service.findFirst({
      where: { id: query.serviceId, workspaceId: workspace.id },
      include: {
        staffServices: {
          include: {
            staff: {
              include: {
                workingHours: true,
                scheduleExceptions: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Service not found.',
      });
    }

    const location = await this.prisma.location.findFirst({
      where: { id: query.locationId, workspaceId: workspace.id },
    });

    if (!location) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Location not found.',
      });
    }

    // Determine eligible staff members
    let eligibleStaff = service.staffServices
      .map((ss) => ss.staff)
      .filter((s) => s.isActive);

    if (query.staffId) {
      eligibleStaff = eligibleStaff.filter((s) => s.id === query.staffId);
    }

    if (eligibleStaff.length === 0) {
      return {
        date: query.date,
        timezone: query.timezone || location.timezone,
        slots: [],
      };
    }

    // Query date parsing
    const targetDate = new Date(query.date);
    const weekday = targetDate.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate day range in UTC
    const dayStartUtc = new Date(`${query.date}T00:00:00Z`);
    const dayEndUtc = new Date(`${query.date}T23:59:59Z`);

    // Fetch existing confirmed bookings and active unexpired holds on this day
    const existingAllocations = await this.prisma.reservationAllocation.findMany({
      where: {
        resourceId: { in: eligibleStaff.map((s) => s.id) },
        startsAt: { lte: dayEndUtc },
        endsAt: { gte: dayStartUtc },
        OR: [
          { status: 'CONFIRMED' },
          {
            status: 'HELD',
            booking: {
              holds: {
                some: {
                  status: HoldStatus.ACTIVE,
                  expiresAt: { gt: new Date() },
                },
              },
            },
          },
        ],
      },
    });

    const slots: TimeSlot[] = [];
    const intervalMinutes = 30; // standard slot increment
    const durationMinutes = service.durationMinutes;
    const bufferBefore = service.bufferBeforeMinutes;
    const bufferAfter = service.bufferAfterMinutes;

    for (const staff of eligibleStaff) {
      // 1. Check date exception (e.g., Vacation or Holiday)
      const exception = staff.scheduleExceptions.find((e) => e.date === query.date);
      if (exception && exception.type === 'TIME_OFF') {
        continue;
      }

      // 2. Check weekly working hours for this day of week
      const hours = staff.workingHours.find(
        (wh) => wh.locationId === location.id && wh.weekday === weekday,
      );

      if (!hours) {
        continue; // Off duty
      }

      const [startHour, startMin] = hours.startLocal.split(':').map(Number);
      const [endHour, endMin] = hours.endLocal.split(':').map(Number);

      const staffShiftStart = new Date(
        Date.UTC(
          targetDate.getUTCFullYear(),
          targetDate.getUTCMonth(),
          targetDate.getUTCDate(),
          startHour,
          startMin,
        ),
      );

      const staffShiftEnd = new Date(
        Date.UTC(
          targetDate.getUTCFullYear(),
          targetDate.getUTCMonth(),
          targetDate.getUTCDate(),
          endHour,
          endMin,
        ),
      );

      // Breaks
      let breakStartTime: Date | null = null;
      let breakEndTime: Date | null = null;
      if (hours.breakStart && hours.breakEnd) {
        const [bsh, bsm] = hours.breakStart.split(':').map(Number);
        const [beh, bem] = hours.breakEnd.split(':').map(Number);
        breakStartTime = new Date(
          Date.UTC(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate(),
            bsh,
            bsm,
          ),
        );
        breakEndTime = new Date(
          Date.UTC(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate(),
            beh,
            bem,
          ),
        );
      }

      // Generate candidate slots in 30-min increments
      let currentCandidate = new Date(staffShiftStart);

      while (
        new Date(currentCandidate.getTime() + durationMinutes * 60000) <= staffShiftEnd
      ) {
        const slotStart = new Date(currentCandidate);
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

        // Occupancy range includes buffer before and buffer after
        const occupancyStart = new Date(slotStart.getTime() - bufferBefore * 60000);
        const occupancyEnd = new Date(slotEnd.getTime() + bufferAfter * 60000);

        // Check break overlap
        let overlapsBreak = false;
        if (breakStartTime && breakEndTime) {
          if (occupancyStart < breakEndTime && occupancyEnd > breakStartTime) {
            overlapsBreak = true;
          }
        }

        // Check conflict with existing allocations
        const staffAllocations = existingAllocations.filter(
          (a) => a.resourceId === staff.id,
        );

        const hasConflict = staffAllocations.some((a) => {
          return occupancyStart < a.endsAt && occupancyEnd > a.startsAt;
        });

        if (!overlapsBreak && !hasConflict) {
          slots.push({
            startsAt: slotStart.toISOString(),
            endsAt: slotEnd.toISOString(),
            staffId: staff.id,
            staffName: staff.displayName,
            available: true,
          });
        }

        // Advance by slot increment
        currentCandidate = new Date(currentCandidate.getTime() + intervalMinutes * 60000);
      }
    }

    // Sort slots chronologically
    slots.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    return {
      date: query.date,
      timezone: query.timezone || location.timezone,
      slots,
    };
  }
}
