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
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @ApiOkResponse({ type: Company, description: 'Created company' })
  async create(@Body() data: Partial<Company>): Promise<Company> {
    return this.service.create(data);
  }

  @Get()
  @ApiOkResponse({
    type: Company,
    isArray: true,
    description: 'List all companies',
  })
  async findAll(): Promise<Company[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Company, description: 'Get company by id' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async findOne(@Param('id') id: string): Promise<Company> {
    const company = await this.service.findOne(id);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  @Put(':id')
  @ApiOkResponse({ type: Company, description: 'Update company by id' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Company>,
  ): Promise<Company> {
    const company = await this.service.update(id, data);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete company by id', type: Object })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async remove(@Param('id') id: string): Promise<{ success: true }> {
    const ok = await this.service.remove(id);
    if (!ok) throw new NotFoundException('Company not found');
    return { success: true };
  }
}
