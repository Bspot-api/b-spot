import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Fund } from '../fund/fund.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';
import { EntityRelationCacheService } from './entity-relation-cache.service';
import { EntityRelationController } from './entity-relation.controller';
import { EntityRelation } from './entity-relation.entity';
import { EntityRelationService } from './entity-relation.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([EntityRelation, Fund, Sector, Personality]),
  ],
  controllers: [EntityRelationController],
  providers: [EntityRelationService, EntityRelationCacheService],
  exports: [EntityRelationService, EntityRelationCacheService],
})
export class EntityRelationModule {}
