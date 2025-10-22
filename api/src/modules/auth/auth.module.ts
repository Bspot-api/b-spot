import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account } from './entities/account.entity';
import { Session } from './entities/session.entity';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, Account, Session, Verification])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
