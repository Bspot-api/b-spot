import { DataTableFacetedFilter } from '@/features/home/components/data-table-faceted-filter'
import { useSectors } from '@/hooks/use-sectors'
import { useTranslation } from 'react-i18next'
import type { Column } from '@tanstack/react-table'

interface FilterSectorsProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function FilterSectors<TData, TValue>({ column }: FilterSectorsProps<TData, TValue>) {
  const { data: sectors = [], isLoading: sectorsLoading } = useSectors()
  const { t } = useTranslation()

  return (
    <DataTableFacetedFilter
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
