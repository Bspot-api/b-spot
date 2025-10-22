import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity({ tableName: 'account' })
export class Account {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text' })
  @Index()
  userId!: string;

  @Property({ type: 'text' })
  accountId!: string;

  @Property({ type: 'text' })
  providerId!: string;

  @Property({ type: 'text', nullable: true })
  accessToken?: string;

  @Property({ type: 'text', nullable: true })
  refreshToken?: string;

  @Property({ type: 'text', nullable: true })
  idToken?: string;

  @Property({ nullable: true })
  accessTokenExpiresAt?: Date;

  @Property({ nullable: true })
  refreshTokenExpiresAt?: Date;

  @Property({ type: 'text', nullable: true })
  scope?: string;

  @Property({ nullable: true, type: 'text' })
  password?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
