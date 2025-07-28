import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { betterAuthConfig } from '../../config/better-auth.config';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'BETTER_AUTH_CONFIG',
      useValue: betterAuthConfig,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
