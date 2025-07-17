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
import { Fund } from './fund.entity';
import { FundService } from './fund.service';

@ApiTags('funds')
@Controller('funds')
export class FundController {
  constructor(private readonly service: FundService) {}

  @Post()
  async create(@Body() data: Partial<Fund>) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fund = await this.service.findOne(id);
    if (!fund) throw new NotFoundException('Fund not found');
    return fund;
  }

  @Get(':id/companies')
  @ApiOkResponse({
    type: Company,
    isArray: true,
    description: 'List all companies for this fund',
  })
  async getCompanies(@Param('id') id: string): Promise<Company[]> {
    return this.service.getCompanies(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Fund>) {
    const fund = await this.service.update(id, data);
    if (!fund) throw new NotFoundException('Fund not found');
    return fund;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Fund not found');
    return { success: true };
  }
}
