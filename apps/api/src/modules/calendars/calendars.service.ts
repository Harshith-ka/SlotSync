import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CalendarsService {
  constructor(private prisma: PrismaService) {}

  async listConnections(workspaceId: string) {
    return this.prisma.calendarConnection.findMany({
      where: { workspaceId },
      include: {
        staff: true,
        _count: {
          select: { busyTimes: true },
        },
      },
    });
  }

  async connectProvider(workspaceId: string, staffId: string, provider: 'GOOGLE' | 'OUTLOOK') {
    const staff = await this.prisma.staffProfile.findFirst({
      where: { id: staffId, workspaceId },
    });

    if (!staff) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Staff member not found.',
      });
    }

    const tokenReference = `tok_${uuidv4().replace(/-/g, '')}`;

    const connection = await this.prisma.calendarConnection.upsert({
      where: { id: uuidv4() },
      create: {
        workspaceId,
        staffId,
        provider,
        tokenReference,
        isActive: true,
        lastSyncedAt: new Date(),
      },
      update: {
        tokenReference,
        isActive: true,
        lastSyncedAt: new Date(),
      },
    });

    // Seed sample external busy intervals so the availability engine takes them into account
    const sampleStartsAt = new Date();
    sampleStartsAt.setHours(13, 0, 0, 0);
    const sampleEndsAt = new Date();
    sampleEndsAt.setHours(14, 0, 0, 0);

    await this.prisma.externalBusyInterval.create({
      data: {
        connectionId: connection.id,
        externalEventId: `ext_${uuidv4().substring(0, 8)}`,
        startsAt: sampleStartsAt,
        endsAt: sampleEndsAt,
        summary: 'External Calendar Event (Private)',
      },
    });

    return connection;
  }

  async disconnect(workspaceId: string, connectionId: string) {
    const conn = await this.prisma.calendarConnection.findFirst({
      where: { id: connectionId, workspaceId },
    });

    if (!conn) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Calendar connection not found.',
      });
    }

    return this.prisma.calendarConnection.delete({
      where: { id: connectionId },
    });
  }
}
