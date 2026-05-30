import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { toNodeHandler } from 'better-auth/node';
import { CacheModule } from '../cache/cache.module';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { Account, Session, User, Verification } from './auth.entity';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [CacheModule, MikroOrmModule.forFeature([User, Session, Account, Verification, Admin])],
  controllers: [AdminController],
  providers: [AuthService, AdminService, AuthGuard, AdminGuard],
  exports: [AuthService, AdminService, AuthGuard, AdminGuard],
})
export class AuthModule implements NestModule, OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit(): Promise<void> {
    await this.authService.onModuleInit();
  }

  async configure(consumer: MiddlewareConsumer): Promise<void> {
    await this.onModuleInit();
    const handler = toNodeHandler(this.authService.auth);
    consumer.apply(handler).forRoutes({
      path: 'api/auth/*',
      method: RequestMethod.ALL,
    });
  }
}
