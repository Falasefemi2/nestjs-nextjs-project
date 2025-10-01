import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    // Support both shapes: { role: Role } or { roles: Role[] }
    const userRole = user.role;
    const userRoles = user.roles;

    if (userRole) {
      return requiredRoles.some((role) => userRole === role);
    }

    if (Array.isArray(userRoles)) {
      return requiredRoles.some((role) => userRoles.includes(role));
    }

    return false;
  }
}
