import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';

@Entity({ tableName: 'funds' })
export class Fund {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Fund name' })
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

  @OneToMany(() => Company, (company) => company.fund)
  companies = new Collection<Company>(this);

  @ManyToMany(() => Personality, (personality) => personality.funds, {
    owner: true,
  })
  personalities = new Collection<Personality>(this);

  @ManyToMany(() => Sector, (sector) => sector.funds, {
    owner: true,
  })
  sectors = new Collection<Sector>(this);
}
