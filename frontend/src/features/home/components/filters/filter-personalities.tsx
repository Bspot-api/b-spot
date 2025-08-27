import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import { usePersonalities } from '@/hooks/use-personalities'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface FilterPersonalitiesProps {
  currentPersonalityIds: string[]
  onPersonalityIdsChange: (personalityIds: string[]) => void
}

export function FilterPersonalities({ currentPersonalityIds, onPersonalityIdsChange }: FilterPersonalitiesProps) {
  const { data: personalities = [], isLoading: personalitiesLoading } = usePersonalities()
  const { t } = useTranslation()

  const handleFilterChange = React.useCallback((selectedIds: string[]) => {
    onPersonalityIdsChange(selectedIds)
  }, [onPersonalityIdsChange])

  return (
    <DataTableFilter
      title={t('table.filters.personalities')}
      options={personalities.map(personality => ({
        label: personality.name,
        value: personality.id,
      }))}
      loading={personalitiesLoading}
      selectedValues={currentPersonalityIds}
      onSelectionChange={handleFilterChange}
    />
  )
}
