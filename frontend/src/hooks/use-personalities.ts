import { createEntityQuery } from './use-entity-query';

export interface Personality {
  id: string;
  name: string;
  description?: string;
}

export const usePersonalities = createEntityQuery<Personality>('personalities');
