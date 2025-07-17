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
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';

@ApiTags('sectors')
@Controller('sectors')
export class SectorController {
  constructor(private readonly service: SectorService) {}

  @Post()
  async create(@Body() data: Partial<Sector>) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sector = await this.service.findOne(id);
    if (!sector) throw new NotFoundException('Sector not found');
    return sector;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Sector>) {
    const sector = await this.service.update(id, data);
    if (!sector) throw new NotFoundException('Sector not found');
    return sector;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Sector not found');
    return { success: true };
  }
}
