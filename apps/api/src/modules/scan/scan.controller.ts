import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScanService } from './scan.service';
import { ScanRequestDto, ScanResultDto } from './dto/scan.dto';

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
}
