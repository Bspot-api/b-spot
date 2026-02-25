import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PappersCache } from './pappers-cache.entity';
import { ApiUsageLog } from './api-usage-log.entity';
import { CacheService } from './cache.service';
import { EmailService } from './email.service';

@Module({
  imports: [MikroOrmModule.forFeature([PappersCache, ApiUsageLog])],
  providers: [CacheService, EmailService],
  exports: [CacheService],
})
export class CacheModule {}
