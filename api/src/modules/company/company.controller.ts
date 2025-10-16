import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from './company.dto';
import { Company } from './company.entity';
import { CompanySearchFilters, CompanyService } from './company.service';

export interface PaginatedCompaniesResponse {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: Company,
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with pagination and search' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 30)',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search term for company name, fund name, sector name, or personality name',
    type: String,
  })
  @ApiQuery({
    name: 'fundIds',
    required: false,
    description: 'Filter by fund IDs (comma-separated values)',
    type: String,
  })
  @ApiQuery({
    name: 'sectorIds',
    required: false,
    description: 'Filter by sector IDs (comma-separated values)',
    type: String,
  })
  @ApiQuery({
    name: 'personalityIds',
    required: false,
    description: 'Filter by personality IDs (comma-separated values)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Companies retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Company' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('fundIds') fundIds?: string,
    @Query('sectorIds') sectorIds?: string,
    @Query('personalityIds') personalityIds?: string,
  ): Promise<PaginatedCompaniesResponse> {
    const pageNum = page ? parseInt(page.toString(), 10) : 1;
    const limitNum = limit ? parseInt(limit.toString(), 10) : 30;

    // Handle fundIds parameter - parse comma-separated string to array
    let parsedFundIds: string[] | undefined;
    if (fundIds) {
      parsedFundIds = fundIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }

    // Handle sectorIds parameter - parse comma-separated string to array
    let parsedSectorIds: string[] | undefined;
    if (sectorIds) {
      parsedSectorIds = sectorIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }

    // Handle personalityIds parameter - parse comma-separated string to array
    let parsedPersonalityIds: string[] | undefined;
    if (personalityIds) {
      parsedPersonalityIds = personalityIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }

    const filters: CompanySearchFilters = {
      search,
      fundIds: parsedFundIds,
      sectorIds: parsedSectorIds,
      personalityIds: parsedPersonalityIds,
    };

    return this.companyService.findAllPaginated(pageNum, limitNum, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Company found', type: Company })
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(id);
    return {
      ...company,
      funds: company.funds,
      sectors: company.sectors,
      personalities: company.personalities,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: Company,
  })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
