import { DataTableFacetedFilter } from '@/features/home/components/data-table-faceted-filter'
import { useFunds } from '@/hooks/use-funds'
import { useTranslation } from 'react-i18next'
import type { Column } from '@tanstack/react-table'

interface FilterFundsProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function FilterFunds<TData, TValue>({ column }: FilterFundsProps<TData, TValue>) {
  const { data: funds = [], isLoading: fundsLoading } = useFunds()
  const { t } = useTranslation()

  return (
    <DataTableFacetedFilter
      column={column}
      title={t('table.filters.funds')}
      options={funds.map(fund => ({
        label: fund.name,
        value: fund.id,
      }))}
      loading={fundsLoading}
    />
  )
}
