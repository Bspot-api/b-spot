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
