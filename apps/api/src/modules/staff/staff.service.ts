import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateStaffDto,
  SetWorkingHoursDto,
  CreateScheduleExceptionDto,
} from '@slotsync/shared-types';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateStaffDto) {
    return this.prisma.staffProfile.create({
      data: {
        workspaceId,
        displayName: dto.displayName,
        bio: dto.bio,
        isActive: true,
        staffLocations: dto.locationIds
          ? {
              create: dto.locationIds.map((lId) => ({ locationId: lId })),
            }
          : undefined,
        staffServices: dto.serviceIds
          ? {
              create: dto.serviceIds.map((sId) => ({ serviceId: sId })),
            }
          : undefined,
      },
      include: {
        staffLocations: { include: { location: true } },
        staffServices: { include: { service: true } },
      },
    });
  }

  async list(workspaceId: string) {
    return this.prisma.staffProfile.findMany({
      where: { workspaceId },
      include: {
        staffLocations: { include: { location: true } },
        staffServices: { include: { service: true } },
        workingHours: true,
        scheduleExceptions: true,
      },
    });
  }

  async getById(workspaceId: string, staffId: string) {
    const staff = await this.prisma.staffProfile.findFirst({
      where: { id: staffId, workspaceId },
      include: {
        staffLocations: { include: { location: true } },
        staffServices: { include: { service: true } },
        workingHours: true,
        scheduleExceptions: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!staff) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Staff member not found.',
      });
    }

    return staff;
  }

  async setWorkingHours(workspaceId: string, staffId: string, dto: SetWorkingHoursDto) {
    await this.getById(workspaceId, staffId);

    // Transactionally replace working hours for this location
    return this.prisma.$transaction(async (tx) => {
      await tx.workingHours.deleteMany({
        where: {
          staffId,
          locationId: dto.locationId,
        },
      });

      const records = await Promise.all(
        dto.hours.map((h) =>
          tx.workingHours.create({
            data: {
              staffId,
              locationId: dto.locationId,
              weekday: h.weekday,
              startLocal: h.startLocal,
              endLocal: h.endLocal,
              breakStart: h.breakStart,
              breakEnd: h.breakEnd,
            },
          }),
        ),
      );

      return records;
    });
  }

  async addException(workspaceId: string, staffId: string, dto: CreateScheduleExceptionDto) {
    await this.getById(workspaceId, staffId);

    return this.prisma.scheduleException.create({
      data: {
        staffId,
        date: dto.date,
        type: dto.type,
        startLocal: dto.startLocal,
        endLocal: dto.endLocal,
        reason: dto.reason,
      },
    });
  }
}
