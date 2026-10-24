import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWorkspaceDto, WorkspaceRole } from '@slotsync/shared-types';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    const existing = await this.prisma.workspace.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException({
        code: 'SLUG_IN_USE',
        message: 'This workspace URL slug is already taken.',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          ownerId: userId,
          defaultTimezone: dto.defaultTimezone || 'America/New_York',
          currency: dto.currency || 'USD',
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: WorkspaceRole.OWNER,
        },
      });

      await tx.location.create({
        data: {
          workspaceId: workspace.id,
          name: 'Main Location',
          slug: 'main-location',
          timezone: workspace.defaultTimezone,
        },
      });

      return workspace;
    });
  }

  async listForUser(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            locations: true,
            _count: {
              select: {
                services: true,
                staffProfiles: true,
                bookings: true,
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.workspace,
      role: m.role,
    }));
  }

  async getById(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        locations: true,
        services: true,
        staffProfiles: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    return workspace;
  }
}
