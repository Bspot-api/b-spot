import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SectorController } from './sector.controller';
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';

@Module({
  imports: [MikroOrmModule.forFeature([Sector])],
  providers: [SectorService],
  controllers: [SectorController],
})
export class SectorModule {}
