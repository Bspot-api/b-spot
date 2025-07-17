import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';

@Entity({ tableName: 'personalities' })
export class Personality {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Personality name' })
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

  @ManyToMany(() => Company, (company) => company.personalities)
  companies = new Collection<Company>(this);
}
