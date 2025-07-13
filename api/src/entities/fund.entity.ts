import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './company.entity';

@Entity({ tableName: 'funds' })
export class Fund {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ApiProperty({ description: 'Fund name' })
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
    description: 'Companies linked to this fund',
    type: () => [String],
    required: false,
  })
  @OneToMany(() => Company, (company) => company.fund)
  companies = new Collection<Company>(this);
}
