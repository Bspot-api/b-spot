import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PersonalityController } from './personality.controller';
import { Personality } from './personality.entity';
import { PersonalityService } from './personality.service';

@Module({
  imports: [MikroOrmModule.forFeature([Personality])],
  providers: [PersonalityService],
  controllers: [PersonalityController],
})
export class PersonalityModule {}
