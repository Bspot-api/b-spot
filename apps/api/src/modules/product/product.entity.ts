import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Brand } from '../brand/brand.entity';

export enum ProductSource {
  OPEN_FOOD_FACTS = 'OFF',
  OPEN_BEAUTY_FACTS = 'OBF',
}

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  barcode!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  category?: string;

  @Property({ nullable: true })
  imageUrl?: string;

  @Enum(() => ProductSource)
  source!: ProductSource;

  @ManyToOne(() => Brand, { nullable: true })
  brand?: Brand;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
