import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
import { Fund } from '../fund/fund.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';

@Entity({ tableName: 'brands' })
export class Brand {
  @ApiProperty({ description: 'Brand unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Brand name' })
  @Property({ unique: true })
  @Index()
  name!: string;

  @ApiProperty({ description: 'Brand description' })
  @Property()
  description!: string;

  @ApiProperty({ description: 'Brand official website URL', required: false })
  @Property({ nullable: true })
  source?: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Parent company that owns this brand',
    required: false,
  })
  @ManyToOne(() => Company, { nullable: true })
  company?: Company;

  @ApiProperty({
    description: 'Fund that controls this brand',
    required: false,
  })
  @ManyToOne(() => Fund, { nullable: true })
  fund?: Fund;

  @ApiProperty({
    description: 'Primary sector this brand operates in',
    required: false,
  })
  @ManyToOne(() => Sector, { nullable: true })
  sector?: Sector;

  @ApiProperty({ description: 'Personalities associated with this brand' })
  @ManyToMany(() => Personality, (personality) => personality.brands, {
    owner: true,
  })
  personalities = new Collection<Personality>(this);
}
