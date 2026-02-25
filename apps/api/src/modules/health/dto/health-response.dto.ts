import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Health status of the API',
    example: 'ok',
  })
  status!: string;

  @ApiProperty({
    description: 'Current timestamp in ISO format',
    example: '2026-01-21T15:30:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'API version',
    example: '2.0.0-alpha.1',
  })
  version!: string;
}
