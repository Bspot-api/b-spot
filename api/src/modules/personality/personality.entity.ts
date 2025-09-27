import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../brand/brand.entity';

@Entity({ tableName: 'personalities' })
export class Personality {
  @ApiProperty({ description: 'Personality unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Personality name' })
  @Property({ unique: true })
  @Index()
  name!: string;

  @ApiProperty({ description: 'Personality description' })
  @Property()
  description!: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  // Relations now handled via EntityRelation system
  // @ManyToMany(() => Company, (company) => company.personalities)
  // companies = new Collection<Company>(this);

  // @ManyToMany(() => Fund, (fund) => fund.personalities)
  // funds = new Collection<Fund>(this);

  @ManyToMany(() => Brand, (brand) => brand.personalities)
  brands = new Collection<Brand>(this);

  // Computed properties via EntityRelation system
  @ApiProperty({
    description: 'Related personalities (computed from EntityRelation)',
    type: () => [Personality],
    required: false,
  })
  relatedPersonalities: Personality[] = [];
}
