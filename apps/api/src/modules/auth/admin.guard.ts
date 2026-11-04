import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthenticatedRequest } from './auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.session) {
      throw new UnauthorizedException();
    }

    const admin = await this.adminService.findByUserId(request.session.user.id);
    if (!admin) {
      throw new ForbiddenException();
    }

    request.admin = admin;
    return true;
  }
}
