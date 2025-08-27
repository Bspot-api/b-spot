import { DataTableFilter } from '@/features/home/components/filters/data-table-filter'
import { useSectors } from '@/hooks/use-sectors'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface FilterSectorsProps {
  currentSectorIds: string[]
  onSectorIdsChange: (sectorIds: string[]) => void
}

export function FilterSectors({ currentSectorIds, onSectorIdsChange }: FilterSectorsProps) {
  const { data: sectors = [], isLoading: sectorsLoading } = useSectors()
  const { t } = useTranslation()

  const handleFilterChange = React.useCallback((selectedIds: string[]) => {
    onSectorIdsChange(selectedIds)
  }, [onSectorIdsChange])

  return (
    <DataTableFilter
      title={t('table.filters.sectors')}
      options={sectors.map(sector => ({
        label: sector.name,
        value: sector.id,
      }))}
      loading={sectorsLoading}
      selectedValues={currentSectorIds}
      onSelectionChange={handleFilterChange}
    />
  )
}
