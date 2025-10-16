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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
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
    const personality = await this.service.findOneWithRelations(id);
    if (!personality) throw new NotFoundException('Personality not found');
    return personality;
  }

  @Get(':id/companies')
  @ApiOkResponse({
    type: Company,
    isArray: true,
    description: 'List all companies for this personality',
  })
  async getCompanies(@Param('id') id: string): Promise<Company[]> {
    return this.service.getCompanies(id);
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
