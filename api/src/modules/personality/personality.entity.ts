import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
import { Fund } from '../fund/fund.entity';

@Entity({ tableName: 'personalities' })
export class Personality {
  @ApiProperty({ description: 'Personality unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Personality name' })
  @Property({ unique: true })
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

  @ManyToMany(() => Fund, (fund) => fund.personalities)
  funds = new Collection<Fund>(this);
}
