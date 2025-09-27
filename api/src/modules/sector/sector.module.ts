import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SectorController } from './sector.controller';
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';
import { EntityRelationModule } from '../entity-relation/entity-relation.module';

@Module({
  imports: [MikroOrmModule.forFeature([Sector]), EntityRelationModule],
  providers: [SectorService],
  controllers: [SectorController],
})
export class SectorModule {}
