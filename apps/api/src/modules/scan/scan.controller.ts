import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ScanService } from './scan.service';
import {
  BrandScanRequestDto,
  BrandScanResultDto,
  ScanRequestDto,
  ScanResultDto,
  SirenScanRequestDto,
} from './dto/scan.dto';
import { ScanHistoryResponseDto } from './dto/scan-history.dto';

@ApiTags('scan')
@Controller('api/scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get('history')
  @ApiOperation({
    summary: 'Get scan history (scaffolded — returns empty list until auth is implemented)',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({ status: 200, type: ScanHistoryResponseDto })
  getHistory(@Query('limit') limit = 50, @Query('offset') offset = 0): ScanHistoryResponseDto {
    const rawLimit = String(limit).trim();
    const rawOffset = String(offset).trim();
    const limitNum = rawLimit === '' || Number.isNaN(Number(rawLimit)) ? 50 : Number(rawLimit);
    const offsetNum = rawOffset === '' || Number.isNaN(Number(rawOffset)) ? 0 : Number(rawOffset);
    const parsedLimit = Math.min(Math.max(limitNum, 1), 100);
    const parsedOffset = Math.max(offsetNum, 0);
    return this.scanService.getHistory(parsedLimit, parsedOffset);
  }

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
