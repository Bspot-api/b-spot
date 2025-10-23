import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { Company } from '../company/company.entity';
import { Personality } from './personality.entity';
import { CreatePersonalityDto, UpdatePersonalityDto } from './personality.dto';
import { PersonalityService } from './personality.service';

@ApiTags('personalities')
@Controller('personalities')
export class PersonalityController {
  constructor(private readonly service: PersonalityService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreatePersonalityDto) {
    return this.service.create(data);
  }

  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string) {
    const personality = await this.service.findOneWithRelations(id);
    if (!personality) throw new NotFoundException('Personality not found');
    return personality;
  }

  @Get(':id/companies')
  @AllowAnonymous()
  @ApiOkResponse({
    type: Company,
    isArray: true,
    description: 'List all companies for this personality',
  })
  async getCompanies(@Param('id') id: string): Promise<Company[]> {
    return this.service.getCompanies(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() data: UpdatePersonalityDto) {
    const personality = await this.service.update(id, data);
    if (!personality) throw new NotFoundException('Personality not found');
    return personality;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Personality not found');
    return { success: true };
  }
}
