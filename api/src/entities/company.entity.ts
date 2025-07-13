import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Fund } from './fund.entity';
import { Personality } from './personality.entity';

@Entity({ tableName: 'companies' })
export class Company {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ApiProperty({ description: 'Company name' })
  @Property()
  name!: string;

  @ApiProperty({ description: 'Source link (URL)' })
  @Property()
  source!: string;

  @ApiProperty({ description: 'Sector' })
  @Property()
  sector!: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ description: 'Investment fund', type: () => Fund })
  @ManyToOne(() => Fund)
  fund!: Fund;

  @ApiProperty({
    description: 'Linked personalities',
    type: () => [Personality],
    required: false,
  })
  @ManyToMany(() => Personality, (personality) => personality.companies)
  personalities = new Collection<Personality>(this);
}
