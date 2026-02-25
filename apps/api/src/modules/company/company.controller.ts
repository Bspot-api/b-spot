import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';

@ApiTags('companies')
@Controller('api/companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':siren')
  @ApiOperation({ summary: 'Get company details by SIREN number' })
  @ApiParam({ name: 'siren', example: '552108011', description: '9-digit French SIREN' })
  @ApiResponse({ status: 200, type: CompanyDto })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  async getCompany(@Param('siren') siren: string): Promise<CompanyDto> {
    const company = await this.companyService.getOrCreateCompany(siren);
    if (!company) throw new NotFoundException('Entreprise non trouvée dans Pappers');
    return this.companyService.toDto(company);
  }
}
