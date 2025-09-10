import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EntityRelationModule } from '../entity-relation/entity-relation.module';
import { PersonalityRelation } from './personality-relation.entity';
import { PersonalityRelationService } from './personality-relation.service';
import { PersonalityController } from './personality.controller';
import { Personality } from './personality.entity';
import { PersonalityService } from './personality.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Personality, PersonalityRelation]),
    EntityRelationModule,
  ],
  providers: [PersonalityService, PersonalityRelationService],
  controllers: [PersonalityController],
  exports: [PersonalityService, PersonalityRelationService],
})
export class PersonalityModule {}
