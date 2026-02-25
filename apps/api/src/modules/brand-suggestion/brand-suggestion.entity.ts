import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum BrandSuggestionStatus {
  NEW = 'new',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class BrandSuggestion {
  @PrimaryKey()
  id!: number;

  @Property()
  brandName!: string;

  @Property({ nullable: true })
  barcode?: string;

  @Property({ nullable: true })
  productName?: string;

  @Property({ nullable: true })
  productImageUrl?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ nullable: true })
  offBrandRaw?: string;

  @Enum(() => BrandSuggestionStatus)
  status: BrandSuggestionStatus = BrandSuggestionStatus.NEW;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
