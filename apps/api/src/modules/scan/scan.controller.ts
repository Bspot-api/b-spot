import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScanService } from './scan.service';
import { BrandScanRequestDto, BrandScanResultDto, ScanRequestDto, ScanResultDto, SirenScanRequestDto } from './dto/scan.dto';

@ApiTags('scan')
@Controller('api/scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post()
  @ApiOperation({ summary: 'Scan a product barcode and return company ownership data' })
  @ApiBody({ type: ScanRequestDto })
  @ApiResponse({ status: 201, type: ScanResultDto, description: 'Product and company data' })
  @ApiResponse({ status: 404, description: 'Product not found in Open Food Facts' })
  async scanProduct(@Body() body: ScanRequestDto): Promise<ScanResultDto> {
    return this.scanService.scanProduct(body.barcode);
  }

  @Post('brand')
  @ApiOperation({ summary: 'Search company by brand name' })
  @ApiBody({ type: BrandScanRequestDto })
  @ApiResponse({ status: 201, type: BrandScanResultDto, description: 'Company data for the brand' })
  async scanByBrand(@Body() body: BrandScanRequestDto): Promise<BrandScanResultDto> {
    return this.scanService.scanByBrandName(body.brandName);
  }

  @Post('siren')
  @ApiOperation({ summary: 'Lookup company by SIREN and optionally create a brand mapping' })
  @ApiBody({ type: SirenScanRequestDto })
  @ApiResponse({ status: 201, type: BrandScanResultDto, description: 'Company data for the SIREN' })
  async scanBySiren(@Body() body: SirenScanRequestDto): Promise<BrandScanResultDto> {
    return this.scanService.scanBySiren(body.siren, body.brandName);
  }
}
