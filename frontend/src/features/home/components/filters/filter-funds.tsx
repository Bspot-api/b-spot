import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import { useFunds } from '@/hooks/use-funds'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface FilterFundsProps {
  currentFundIds: string[]
  onFundIdsChange: (fundIds: string[]) => void
}

export function FilterFunds({ currentFundIds, onFundIdsChange }: FilterFundsProps) {
  const { data: funds = [], isLoading: fundsLoading } = useFunds()
  const { t } = useTranslation()

  const handleFilterChange = React.useCallback((selectedIds: string[]) => {
    onFundIdsChange(selectedIds)
  }, [onFundIdsChange])

  return (
    <DataTableFilter
      title={t('table.filters.funds')}
      options={funds.map(fund => ({
        label: fund.name,
        value: fund.id,
      }))}
      loading={fundsLoading}
      selectedValues={currentFundIds}
      onSelectionChange={handleFilterChange}
    />
  )
}
