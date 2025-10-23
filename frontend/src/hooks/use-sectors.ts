import { createEntityQuery } from './use-entity-query';

export interface Sector {
  id: string;
  name: string;
  description?: string;
  companyCount: number;
}

export const useSectors = createEntityQuery<Sector>('sectors');
