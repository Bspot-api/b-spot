import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import { useFunds } from '@/hooks/use-funds'
import type { Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

interface FilterFundsProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function FilterFunds<TData, TValue>({ column }: FilterFundsProps<TData, TValue>) {
  const { data: funds = [], isLoading: fundsLoading } = useFunds()
  const { t } = useTranslation()

  return (
    <DataTableFilter
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
