import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'Success', type: [Brand] })
  async findAll(): Promise<Brand[]> {
    return this.brandService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiResponse({ status: 200, description: 'Success', type: Brand })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findOne(@Param('id') id: string): Promise<Brand | null> {
    return this.brandService.findOne(id);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get brands by company ID' })
  @ApiResponse({ status: 200, description: 'Success', type: [Brand] })
  async findByCompany(@Param('companyId') companyId: string): Promise<Brand[]> {
    return this.brandService.findByCompany(companyId);
  }

  @Get('fund/:fundId')
  @ApiOperation({ summary: 'Get brands by fund ID' })
  @ApiResponse({ status: 200, description: 'Success', type: [Brand] })
  async findByFund(@Param('fundId') fundId: string): Promise<Brand[]> {
    return this.brandService.findByFund(fundId);
  }

  @Get('sector/:sectorId')
  @ApiOperation({ summary: 'Get brands by sector ID' })
  @ApiResponse({ status: 200, description: 'Success', type: [Brand] })
  async findBySector(@Param('sectorId') sectorId: string): Promise<Brand[]> {
    return this.brandService.findBySector(sectorId);
  }
}
