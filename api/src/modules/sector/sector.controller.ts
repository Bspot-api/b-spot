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
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';

@ApiTags('sectors')
@Controller('sectors')
export class SectorController {
  constructor(private readonly service: SectorService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: Partial<Sector>) {
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
    const sector = await this.service.findOne(id);
    if (!sector) throw new NotFoundException('Sector not found');
    return sector;
  }

  @Get(':id/companies')
  @AllowAnonymous()
  @ApiOkResponse({
    type: Company,
    isArray: true,
    description: 'List all companies for this sector',
  })
  async getCompanies(@Param('id') id: string): Promise<Company[]> {
    return this.service.getCompanies(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() data: Partial<Sector>) {
    const sector = await this.service.update(id, data);
    if (!sector) throw new NotFoundException('Sector not found');
    return sector;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Sector not found');
    return { success: true };
  }
}
