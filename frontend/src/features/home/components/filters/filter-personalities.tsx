import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import { usePersonalities } from '@/hooks/use-personalities'
import type { Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

interface FilterPersonalitiesProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function FilterPersonalities<TData, TValue>({ column }: FilterPersonalitiesProps<TData, TValue>) {
  const { data: personalities = [], isLoading: personalitiesLoading } = usePersonalities()
  const { t } = useTranslation()

  return (
    <DataTableFilter
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
