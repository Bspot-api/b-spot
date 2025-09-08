import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityRelation } from './entity-relation.entity';
import { EntityRelationController } from './entity-relation.controller';
import { EntityRelationService } from './entity-relation.service';

@Module({
  imports: [MikroOrmModule.forFeature([EntityRelation])],
  controllers: [EntityRelationController],
  providers: [EntityRelationService],
  exports: [EntityRelationService],
})
export class EntityRelationModule {}