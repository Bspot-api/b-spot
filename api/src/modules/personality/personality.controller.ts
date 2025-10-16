import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
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
    description: 'List companies for this personality with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 20)',
    type: Number,
  })
  async getCompanies(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page ? parseInt(page.toString(), 10) : 1;
    const limitNum = limit ? parseInt(limit.toString(), 10) : 20;
    return this.service.getCompaniesPaginated(id, pageNum, limitNum);
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
