import type { Company as GeneratedCompany } from '@/api/hooks'

export type RelationType =
  | 'invests_in'
  | 'operates_in'
  | 'founded'
  | 'leads'
  | 'is_connected_to'
  | 'works_at'

export interface RelationMatch {
  filterType: 'fund' | 'sector' | 'personality'
  filterId: string
  filterName: string
  relationType: RelationType
  via?: 'direct' | 'fund'
  viaEntityId?: string
  viaEntityName?: string
}

export interface Company extends GeneratedCompany {
  matchedVia?: RelationMatch[]
}
