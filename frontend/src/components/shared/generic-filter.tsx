import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Entity {
  id: string
  name: string
}

interface GenericFilterProps<T extends Entity> {
  translationKey: string
  useHook: () => { data?: T[]; isLoading: boolean }
  selectedIds: string[]
  onIdsChange: (ids: string[]) => void
}

export function GenericFilter<T extends Entity>({
  translationKey,
  useHook,
  selectedIds,
  onIdsChange,
}: GenericFilterProps<T>) {
  const { data = [], isLoading } = useHook()
  const { t } = useTranslation()

  const handleFilterChange = React.useCallback((selectedIds: string[]) => {
    onIdsChange(selectedIds)
  }, [onIdsChange])

  return (
    <DataTableFilter
      title={t(translationKey)}
      options={data.map(entity => ({
        label: entity.name,
        value: entity.id,
      }))}
      loading={isLoading}
      selectedValues={selectedIds}
      onSelectionChange={handleFilterChange}
    />
  )
}
