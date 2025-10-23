import { GenericFilter } from '@/components/shared/generic-filter'
import { useFunds } from '@/hooks/use-funds'

interface FilterFundsProps {
  currentFundIds: string[]
  onFundIdsChange: (fundIds: string[]) => void
}

export function FilterFunds({ currentFundIds, onFundIdsChange }: FilterFundsProps) {
  return (
    <GenericFilter
      translationKey="table.filters.funds"
      useHook={useFunds}
      selectedIds={currentFundIds}
      onIdsChange={onFundIdsChange}
    />
  )
}
