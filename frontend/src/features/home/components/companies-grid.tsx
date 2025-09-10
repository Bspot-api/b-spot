"use client"

import React from "react"
import { useTranslation } from "react-i18next"

import type { Company } from "@/api/hooks"
import { useDebounce } from "@/hooks/use-debounce"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"

import { Input } from "@/components/shadcn/input"
import { CompanyCard } from "./company-card"
import { CompanyCardSkeleton } from "./company-card-skeleton"
import { FilterFunds, FilterPersonalities, FilterSectors } from "./filters"

export interface CompaniesGridProps {
  companies: Company[]
  currentSearch: string
  onSearchChange: (search: string) => void
  currentSectorIds: string[]
  onSectorIdsChange: (sectorIds: string[]) => void
  currentFundIds: string[]
  onFundIdsChange: (fundIds: string[]) => void
  currentPersonalityIds: string[]
  onPersonalityIdsChange: (personalityIds: string[]) => void
  isLoading?: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
}

export function CompaniesGrid({ 
  companies, 
  currentSearch,
  onSearchChange,
  currentSectorIds,
  onSectorIdsChange,
  currentFundIds,
  onFundIdsChange,
  currentPersonalityIds,
  onPersonalityIdsChange,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage
}: CompaniesGridProps) {

  const [localSearch, setLocalSearch] = React.useState(currentSearch)

  // Use debounce hook for search
  const debouncedSearch = useDebounce(localSearch, 500)

  // Update parent search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, currentSearch, onSearchChange])

  // Sync local search with prop changes
  React.useEffect(() => {
    setLocalSearch(currentSearch)
  }, [currentSearch])

  const { t } = useTranslation()

  // Set up infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: fetchNextPage || (() => {}),
  })

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={t('companies.searchPlaceholder')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <FilterSectors
              currentSectorIds={currentSectorIds}
              onSectorIdsChange={onSectorIdsChange}
            />
            <FilterFunds
              currentFundIds={currentFundIds}
              onFundIdsChange={onFundIdsChange}
            />
            <FilterPersonalities
              currentPersonalityIds={currentPersonalityIds}
              onPersonalityIdsChange={onPersonalityIdsChange}
            />
          </div>
        </div>
      </div>
      
      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
          
          {/* Loading more skeletons */}
          {isFetchingNextPage && (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <CompanyCardSkeleton key={`loading-${index}`} />
              ))}
            </>
          )}
          
          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="col-span-full h-4" />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {currentSearch ? t('companies.noResultsForSearch', { search: currentSearch }) : t('companies.noResults')}
          </p>
        </div>
      )}
    </div>
  )
}
