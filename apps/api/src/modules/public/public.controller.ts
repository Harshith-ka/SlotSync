import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Controller('public/:slug')
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Get('info')
  async getWorkspaceInfo(@Param('slug') slug: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
      include: {
        locations: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            timezone: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      defaultTimezone: workspace.defaultTimezone,
      currency: workspace.currency,
      locations: workspace.locations,
    };
  }

  @Get('services')
  async listPublicServices(@Param('slug') slug: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
    });

    if (!workspace) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Workspace not found.',
      });
    }

    return this.prisma.service.findMany({
      where: {
        workspaceId: workspace.id,
        isPublic: true,
      },
      include: {
        serviceLocations: {
          include: { location: true },
        },
        staffServices: {
          include: {
            staff: {
              select: {
                id: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }
}
