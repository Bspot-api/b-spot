import {
  Collection,
  Entity,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';

@Entity({ tableName: 'sectors' })
export class Sector {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Sector name' })
  @Property({ unique: true })
  @Unique()
  @Index()
  name!: string;

  @ApiProperty({ description: 'Description', required: false })
  @Property({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @OneToMany(() => Company, (company) => company.sector)
  companies = new Collection<Company>(this);
}
