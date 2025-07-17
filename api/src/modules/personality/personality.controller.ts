import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Personality } from './personality.entity';
import { PersonalityService } from './personality.service';

@ApiTags('personalities')
@Controller('personalities')
export class PersonalityController {
  constructor(private readonly service: PersonalityService) {}

  @Post()
  async create(@Body() data: Partial<Personality>) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const personality = await this.service.findOne(id);
    if (!personality) throw new NotFoundException('Personality not found');
    return personality;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Personality>) {
    const personality = await this.service.update(id, data);
    if (!personality) throw new NotFoundException('Personality not found');
    return personality;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Personality not found');
    return { success: true };
  }
}
