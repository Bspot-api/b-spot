import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './auth.entity';

@Entity({ tableName: 'admins' })
export class Admin {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => User, { fieldName: 'userId', unique: true })
  user!: User;

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();
}
