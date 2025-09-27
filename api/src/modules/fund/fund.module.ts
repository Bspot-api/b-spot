import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FundController } from './fund.controller';
import { Fund } from './fund.entity';
import { FundService } from './fund.service';
import { EntityRelationModule } from '../entity-relation/entity-relation.module';

@Module({
  imports: [MikroOrmModule.forFeature([Fund]), EntityRelationModule],
  providers: [FundService],
  controllers: [FundController],
})
export class FundModule {}
