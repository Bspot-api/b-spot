import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandSuggestionService } from './brand-suggestion.service';
import { CreateBrandSuggestionDto } from './dto/create-brand-suggestion.dto';
import { BrandSuggestionDto } from './dto/brand-suggestion.dto';

@ApiTags('brand')
@Controller('api/brand-suggestions')
export class BrandSuggestionController {
  constructor(private readonly brandSuggestionService: BrandSuggestionService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a brand suggestion when automatic resolution is uncertain' })
  @ApiBody({ type: CreateBrandSuggestionDto })
  @ApiResponse({ status: 201, type: BrandSuggestionDto })
  async create(@Body() body: CreateBrandSuggestionDto): Promise<BrandSuggestionDto> {
    const suggestion = await this.brandSuggestionService.create(body);
    return this.brandSuggestionService.toDto(suggestion);
  }
}
