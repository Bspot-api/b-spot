import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum BrandStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  DELETED = 'deleted',
}

export enum BrandMatchSource {
  SEED = 'seed',
  AUTO_DISCOVERY = 'auto_discovery',
  MANUAL_REVIEW = 'manual_review',
}

@Entity()
export class Brand {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @Property()
  siren!: string;

  @Enum(() => BrandStatus)
  status: BrandStatus = BrandStatus.ACTIVE;

  @Property({ type: 'float', nullable: true })
  confidence?: number;

  @Enum({ items: () => BrandMatchSource, nullable: true })
  matchSource?: BrandMatchSource;

  @Property({ nullable: true })
  matchedQuery?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
