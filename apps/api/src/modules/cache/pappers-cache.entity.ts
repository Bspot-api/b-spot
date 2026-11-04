import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

@Entity()
export class PappersCache {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  siren!: string;

  @Property({ type: 'json' })
  responseData!: Record<string, unknown>;

  @Property()
  fetchedAt: Date = new Date();

  @Property()
  expiresAt: Date = new Date(Date.now() + THIRTY_DAYS_MS);
}
