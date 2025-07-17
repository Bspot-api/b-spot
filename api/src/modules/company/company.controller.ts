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
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  async create(@Body() data: Partial<Company>) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.service.findOne(id);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Company>) {
    const company = await this.service.update(id, data);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Company not found');
    return { success: true };
  }
}
