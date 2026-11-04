import { ApiProperty } from '@nestjs/swagger';

export class ScanHistoryItemDto {
  @ApiProperty({ example: '3017620422003', description: 'EAN-8 or EAN-13 barcode' })
  barcode!: string;

  @ApiProperty({ example: 'Nutella' })
  productName!: string;

  @ApiProperty({ example: 'Ferrero' })
  brandName!: string;

  @ApiProperty({ example: 'Ferrero France SAS' })
  companyName!: string;

  @ApiProperty({ example: '552032534', description: 'SIREN 9 digits' })
  companySiren!: string;

  @ApiProperty({
    enum: ['OFF', 'OBF'],
    description: 'OFF = Open Food Facts, OBF = Open Beauty Facts',
  })
  productSource!: 'OFF' | 'OBF';

  @ApiProperty({ example: '2026-05-30T14:22:00.000Z', description: 'ISO 8601 scan timestamp' })
  scannedAt!: string;
}

export class ScanHistoryResponseDto {
  @ApiProperty({ type: [ScanHistoryItemDto] })
  items!: ScanHistoryItemDto[];

  @ApiProperty({ example: 0 })
  total!: number;

  @ApiProperty({ example: 50 })
  limit!: number;

  @ApiProperty({ example: 0 })
  offset!: number;
}
