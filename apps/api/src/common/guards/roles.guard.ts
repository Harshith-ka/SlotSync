import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WorkspaceRole } from '@slotsync/shared-types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<WorkspaceRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'No authenticated user context found.',
      });
    }

    const workspaceId =
      (request.headers['x-workspace-id'] as string) ||
      request.query.workspaceId ||
      request.body.workspaceId ||
      user.workspaceId;

    if (!workspaceId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Workspace context (x-workspace-id) is required for this operation.',
      });
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You are not a member of this workspace.',
      });
    }

    request.workspaceRole = membership.role;
    request.workspaceId = workspaceId;

    const hasRole = requiredRoles.includes(membership.role as WorkspaceRole);
    if (!hasRole) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: `Insufficient permissions. Requires one of: ${requiredRoles.join(', ')}`,
      });
    }

    return true;
  }
}
