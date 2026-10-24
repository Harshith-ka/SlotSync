import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from '@slotsync/shared-types';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateLocationDto) {
    const existing = await this.prisma.location.findUnique({
      where: {
        workspaceId_slug: {
          workspaceId,
          slug: dto.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException({
        code: 'SLUG_IN_USE',
        message: 'A location with this slug already exists in this workspace.',
      });
    }

    return this.prisma.location.create({
      data: {
        workspaceId,
        name: dto.name,
        slug: dto.slug,
        timezone: dto.timezone,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        isActive: true,
      },
    });
  }

  async list(workspaceId: string) {
    return this.prisma.location.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: {
            staffLocations: true,
            serviceLocations: true,
            bookings: true,
          },
        },
      },
    });
  }

  async getById(workspaceId: string, locationId: string) {
    const location = await this.prisma.location.findFirst({
      where: { id: locationId, workspaceId },
      include: {
        staffLocations: {
          include: { staff: true },
        },
        serviceLocations: {
          include: { service: true },
        },
      },
    });

    if (!location) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Location not found.',
      });
    }

    return location;
  }

  async update(workspaceId: string, locationId: string, dto: UpdateLocationDto) {
    await this.getById(workspaceId, locationId);

    return this.prisma.location.update({
      where: { id: locationId },
      data: {
        name: dto.name,
        timezone: dto.timezone,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        isActive: dto.isActive,
      },
    });
  }
}
