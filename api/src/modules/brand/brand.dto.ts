import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ description: 'Brand name' })
  name: string;

  @ApiProperty({ description: 'Brand description' })
  description: string;

  @ApiProperty({ description: 'Brand official website URL', required: false })
  source?: string;

  @ApiProperty({ description: 'Parent company ID', required: false })
  company?: string;

  @ApiProperty({ description: 'Controlling fund ID', required: false })
  fund?: string;

  @ApiProperty({ description: 'Primary sector ID', required: false })
  sector?: string;

  @ApiProperty({
    description: 'Associated personalities IDs',
    type: [String],
    required: false,
  })
  personalities?: string[];
}

export class UpdateBrandDto {
  @ApiProperty({ description: 'Brand name', required: false })
  name?: string;

  @ApiProperty({ description: 'Brand description', required: false })
  description?: string;

  @ApiProperty({ description: 'Brand official website URL', required: false })
  source?: string;

  @ApiProperty({ description: 'Parent company ID', required: false })
  company?: string;

  @ApiProperty({ description: 'Controlling fund ID', required: false })
  fund?: string;

  @ApiProperty({ description: 'Primary sector ID', required: false })
  sector?: string;

  @ApiProperty({
    description: 'Associated personalities IDs',
    type: [String],
    required: false,
  })
  personalities?: string[];
}
