import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'session' })
export class Session {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text' })
  @Index()
  userId!: string;

  @Property({ type: 'text' })
  @Unique()
  token!: string;

  @Property()
  expiresAt!: Date;

  @Property({ type: 'text', nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
