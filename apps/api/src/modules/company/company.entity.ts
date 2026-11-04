import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export interface Executive {
  name: string;
  role: string;
  startDate?: string;
}

export interface Shareholder {
  name: string;
  percentage: number;
  type: 'individual' | 'corporate';
}

@Entity()
export class Company {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  siren!: string;

  @Property()
  legalName!: string;

  @Property({ nullable: true })
  logoUrl?: string;

  @Property({ type: 'json', nullable: true })
  rawPappersData?: Record<string, unknown>;

  @Property({ type: 'json' })
  executives: Executive[] = [];

  @Property({ type: 'json' })
  shareholders: Shareholder[] = [];

  @Property({ type: 'json', nullable: true })
  subsidiaries?: string[];

  @Property()
  lastFetchedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();
}
