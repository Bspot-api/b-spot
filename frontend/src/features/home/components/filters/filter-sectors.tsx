import { GenericFilter } from '@/components/shared/generic-filter'
import { useSectors } from '@/hooks/use-sectors'

interface FilterSectorsProps {
  currentSectorIds: string[]
  onSectorIdsChange: (sectorIds: string[]) => void
}

export function FilterSectors({ currentSectorIds, onSectorIdsChange }: FilterSectorsProps) {
  return (
    <GenericFilter
      translationKey="table.filters.sectors"
      useHook={useSectors}
      selectedIds={currentSectorIds}
      onIdsChange={onSectorIdsChange}
    />
  )
}
