import {
  Collection,
  Entity,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../brand/brand.entity';

@Entity({ tableName: 'sectors' })
export class Sector {
  @ApiProperty({ description: 'Sector unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Sector name' })
  @Property({ unique: true })
  @Index()
  name!: string;

  @ApiProperty({ description: 'Sector description' })
  @Property()
  description!: string;

  @ApiProperty({ description: 'Published status', default: false })
  @Property({ default: false })
  published: boolean = false;

  @ApiProperty({ description: 'Date added' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  // Relations now handled via EntityRelation system
  // @OneToMany(() => Company, (company) => company.sector)
  // companies = new Collection<Company>(this);

  // @ManyToMany(() => Fund, (fund) => fund.sectors)
  // funds = new Collection<Fund>(this);

  @ApiProperty({
    description: 'Brands operating in this sector',
    type: () => [Brand],
  })
  @OneToMany(() => Brand, (brand) => brand.sector)
  brands = new Collection<Brand>(this);
}
