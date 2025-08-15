import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import { useSectors } from '@/hooks/use-sectors'
import type { Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

interface FilterSectorsProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function FilterSectors<TData, TValue>({ column }: FilterSectorsProps<TData, TValue>) {
  const { data: sectors = [], isLoading: sectorsLoading } = useSectors()
  const { t } = useTranslation()

  return (
    <DataTableFilter
      column={column}
      title={t('table.filters.sectors')}
      options={sectors.map(sector => ({
        label: sector.name,
        value: sector.id,
      }))}
      loading={sectorsLoading}
    />
  )
}
