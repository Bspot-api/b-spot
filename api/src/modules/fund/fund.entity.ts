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

@Entity({ tableName: 'funds' })
export class Fund {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Fund name' })
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

  @OneToMany(() => Company, (company) => company.fund)
  companies = new Collection<Company>(this);
}
