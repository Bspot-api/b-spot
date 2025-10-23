import { createEntityQuery } from './use-entity-query';

export interface Fund {
  id: string;
  name: string;
  description?: string;
}

export const useFunds = createEntityQuery<Fund>('funds');
