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
import { Fund } from '../fund/fund.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';

@Entity({ tableName: 'companies' })
export class Company {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Company name' })
  @Property()
  name!: string;

  @ApiProperty({ description: 'Source link (URL)' })
  @Property()
  source!: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @ManyToOne(() => Fund)
  @Index()
  fund!: Fund;

  @ManyToOne(() => Sector)
  @Index()
  sector!: Sector;

  @ManyToMany(() => Personality, (personality) => personality.companies, {
    owner: true,
  })
  personalities = new Collection<Personality>(this);
}
