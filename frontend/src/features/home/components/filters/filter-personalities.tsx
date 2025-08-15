import { DataTableFacetedFilter } from '@/features/home/components/data-table-faceted-filter'
import { usePersonalities } from '@/hooks/use-personalities'
import { useTranslation } from 'react-i18next'
import type { Column } from '@tanstack/react-table'

interface FilterPersonalitiesProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function FilterPersonalities<TData, TValue>({ column }: FilterPersonalitiesProps<TData, TValue>) {
  const { data: personalities = [], isLoading: personalitiesLoading } = usePersonalities()
  const { t } = useTranslation()

  return (
    <DataTableFacetedFilter
      column={column}
      title={t('table.filters.personalities')}
      options={personalities.map(personality => ({
        label: personality.name,
        value: personality.id,
      }))}
      loading={personalitiesLoading}
    />
  )
}
