import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'user' })
export class User {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property()
  @Unique()
  email!: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ nullable: true })
  image?: string;

  @Property({ default: false })
  emailVerified = false;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
