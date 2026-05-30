import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
