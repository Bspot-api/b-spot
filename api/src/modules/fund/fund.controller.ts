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
import { Fund } from './fund.entity';
import { CreateFundDto, UpdateFundDto } from './fund.dto';
import { FundService } from './fund.service';

@ApiTags('funds')
@Controller('funds')
export class FundController {
  constructor(private readonly service: FundService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateFundDto) {
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
    const fund = await this.service.findOne(id);
    if (!fund) throw new NotFoundException('Fund not found');
    return fund;
  }

  @Get(':id/companies')
  @AllowAnonymous()
  @ApiOkResponse({
    type: Company,
    isArray: true,
    description: 'List all companies for this fund',
  })
  async getCompanies(@Param('id') id: string): Promise<Company[]> {
    return this.service.getCompanies(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() data: UpdateFundDto) {
    const fund = await this.service.update(id, data);
    if (!fund) throw new NotFoundException('Fund not found');
    return fund;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Fund not found');
    return { success: true };
  }
}
