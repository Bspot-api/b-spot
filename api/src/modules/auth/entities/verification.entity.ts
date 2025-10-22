import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'verification' })
export class Verification {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text' })
  identifier!: string;

  @Property({ type: 'text' })
  value!: string;

  @Property()
  expiresAt!: Date;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
