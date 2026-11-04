import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum ExternalApi {
  PAPPERS = 'PAPPERS',
  OPEN_FOOD_FACTS = 'OPEN_FOOD_FACTS',
  OPEN_BEAUTY_FACTS = 'OPEN_BEAUTY_FACTS',
}

@Entity()
export class ApiUsageLog {
  @PrimaryKey()
  id!: number;

  @Enum(() => ExternalApi)
  api!: ExternalApi;

  @Property()
  endpoint!: string;

  @Property({ nullable: true })
  requestParams?: string;

  @Property()
  success!: boolean;

  @Property({ nullable: true })
  errorMessage?: string;

  @Property()
  timestamp: Date = new Date();
}
