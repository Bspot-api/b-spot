import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './company.entity';

@Entity({ tableName: 'personalities' })
export class Personality {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ApiProperty({ description: 'Personality name' })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({ description: 'Description', required: false })
  @Property({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Companies linked to this personality',
    type: () => [String],
    required: false,
  })
  @ManyToMany(() => Company, (company) => company.personalities)
  companies = new Collection<Company>(this);
}
