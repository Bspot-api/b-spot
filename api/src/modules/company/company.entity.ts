import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../brand/brand.entity';
import { RelationType } from '../entity-relation/entity-relation.entity';
import { Fund } from '../fund/fund.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';

export interface RelationMatch {
  filterType: 'fund' | 'sector' | 'personality';
  filterId: string;
  filterName: string;
  relationType: RelationType;
  via?: 'direct' | 'fund';
  viaEntityId?: string;
  viaEntityName?: string;
}

@Entity({ tableName: 'companies' })
export class Company {
  @ApiProperty({ description: 'Company unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Company name' })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({ description: 'Company description' })
  @Property({ type: 'text' })
  description!: string;

  @ApiProperty({ description: 'Source link (URL)' })
  @Property({ type: 'text' })
  source!: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Brands owned by this company',
    type: () => [Brand],
  })
  @OneToMany(() => Brand, (brand) => brand.company)
  brands = new Collection<Brand>(this);

  // Computed properties via EntityRelation system
  @ApiProperty({
    description: 'Investment funds (computed from EntityRelation)',
    type: () => [Fund],
    required: false,
  })
  funds: Fund[] = [];

  @ApiProperty({
    description: 'Business sectors (computed from EntityRelation)',
    type: () => [Sector],
    required: false,
  })
  sectors: Sector[] = [];

  @ApiProperty({
    description: 'Involved personalities (computed from EntityRelation)',
    type: () => [Personality],
    required: false,
  })
  personalities: Personality[] = [];

  @ApiProperty({
    description: 'Relation context when filtered (how this company matched the filters)',
    type: 'array',
    required: false,
  })
  matchedVia?: RelationMatch[];
}
