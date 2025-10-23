import { GenericFilter } from '@/components/shared/generic-filter'
import { usePersonalities } from '@/hooks/use-personalities'

interface FilterPersonalitiesProps {
  currentPersonalityIds: string[]
  onPersonalityIdsChange: (personalityIds: string[]) => void
}

export function FilterPersonalities({ currentPersonalityIds, onPersonalityIdsChange }: FilterPersonalitiesProps) {
  return (
    <GenericFilter
      translationKey="table.filters.personalities"
      useHook={usePersonalities}
      selectedIds={currentPersonalityIds}
      onIdsChange={onPersonalityIdsChange}
    />
  )
}
