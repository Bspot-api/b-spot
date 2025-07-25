import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  email!: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: false })
  emailVerified = false;

  @Property({ nullable: true })
  emailVerificationToken?: string;

  @Property({ nullable: true })
  emailVerificationTokenExpiresAt?: Date;

  @Property({ nullable: true })
  passwordResetToken?: string;

  @Property({ nullable: true })
  passwordResetTokenExpiresAt?: Date;

  @Property({ default: false })
  isActive = true;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
