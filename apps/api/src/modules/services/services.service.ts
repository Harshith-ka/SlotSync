import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from '@slotsync/shared-types';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        workspaceId,
        name: dto.name,
        description: dto.description,
        durationMinutes: dto.durationMinutes,
        bufferBeforeMinutes: dto.bufferBeforeMinutes || 0,
        bufferAfterMinutes: dto.bufferAfterMinutes || 0,
        priceMinor: dto.priceMinor,
        currency: dto.currency || 'USD',
        bookingLeadMinutes: dto.bookingLeadMinutes || 60,
        bookingHorizonDays: dto.bookingHorizonDays || 60,
        isPublic: dto.isPublic !== undefined ? dto.isPublic : true,
        requiresRoomResource: dto.requiresRoomResource || false,
        serviceLocations: dto.locationIds
          ? {
              create: dto.locationIds.map((locId) => ({ locationId: locId })),
            }
          : undefined,
        staffServices: dto.staffIds
          ? {
              create: dto.staffIds.map((sId) => ({ staffId: sId })),
            }
          : undefined,
      },
      include: {
        serviceLocations: true,
        staffServices: {
          include: {
            staff: true,
          },
        },
      },
    });
  }

  async list(workspaceId: string) {
    return this.prisma.service.findMany({
      where: { workspaceId },
      include: {
        serviceLocations: {
          include: { location: true },
        },
        staffServices: {
          include: { staff: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async getById(workspaceId: string, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, workspaceId },
      include: {
        serviceLocations: {
          include: { location: true },
        },
        staffServices: {
          include: { staff: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Service not found.',
      });
    }

    return service;
  }

  async update(workspaceId: string, serviceId: string, dto: UpdateServiceDto) {
    await this.getById(workspaceId, serviceId);

    return this.prisma.service.update({
      where: { id: serviceId },
      data: {
        name: dto.name,
        description: dto.description,
        durationMinutes: dto.durationMinutes,
        bufferBeforeMinutes: dto.bufferBeforeMinutes,
        bufferAfterMinutes: dto.bufferAfterMinutes,
        priceMinor: dto.priceMinor,
        currency: dto.currency,
        bookingLeadMinutes: dto.bookingLeadMinutes,
        bookingHorizonDays: dto.bookingHorizonDays,
        isPublic: dto.isPublic,
        requiresRoomResource: dto.requiresRoomResource,
      },
    });
  }
}
