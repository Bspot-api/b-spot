import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BrandSuggestionDto } from '../../brand-suggestion/dto/brand-suggestion.dto';
import { BrandSuggestionStatus } from '../../brand-suggestion/brand-suggestion.entity';

export class PromoteAdminDto {
  @ApiProperty({ example: '01970000-0000-7000-8000-000000000002' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class AdminProfileDto {
  @ApiProperty({ format: 'uuid' })
  adminId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  promotedAt!: string;
}

export class AdminUserDto {
  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  name!: string;
}

export class AdminRecordDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ type: AdminUserDto })
  user!: AdminUserDto;

  @ApiProperty()
  createdAt!: string;
}

export class ListBrandSuggestionsQueryDto {
  @ApiPropertyOptional({ enum: BrandSuggestionStatus })
  @IsOptional()
  @IsEnum(BrandSuggestionStatus)
  status?: BrandSuggestionStatus;
}

export class UpdateBrandSuggestionStatusDto {
  @ApiProperty({ enum: BrandSuggestionStatus })
  @IsEnum(BrandSuggestionStatus)
  @IsNotEmpty()
  status!: BrandSuggestionStatus;
}

export class BrandSuggestionListDto {
  @ApiProperty({ type: [BrandSuggestionDto] })
  items!: BrandSuggestionDto[];

  @ApiProperty()
  total!: number;
}
