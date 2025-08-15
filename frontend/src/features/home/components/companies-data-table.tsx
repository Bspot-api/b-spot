"use client"

import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import React from "react"
import { useTranslation } from "react-i18next"

import type { Company } from "@/api/hooks"
import { useDebounce } from "@/hooks/use-debounce"

import { Input } from "@/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { FilterFunds, FilterPersonalities, FilterSectors } from "./filters"
import { CompaniesPagination } from "./filters/pagination"
import { ShowNumberByPage } from "./table"
import { useCompanyColumns } from "./table/columns"

export interface CompaniesDataTableProps {
  companies: Company[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  currentSearch: string
  onSearchChange: (search: string) => void
  currentLimit: number
  onLimitChange: (limit: number) => void
  isSearching?: boolean
}


export function CompaniesDataTable({ 
  companies, 
  currentPage, 
  totalPages, 
  onPageChange,
  currentSearch,
  onSearchChange,
  currentLimit,
  onLimitChange,
  isSearching = false
}: CompaniesDataTableProps) {
  const { t } = useTranslation();
  const columns = useCompanyColumns();
  
  // Safety check to ensure all required props are valid
  if (typeof currentPage !== 'number' || typeof totalPages !== 'number' || typeof currentLimit !== 'number') {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-600">{t('companies.loadingParams')}</p>
      </div>
    );
  }

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
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



  // Apply filters to companies
  const filteredCompanies = React.useMemo(() => {
    return companies.filter(company => {
      // Get filter values for each column
      const sectorFilter = columnFilters.find(f => f.id === 'sector')?.value as string[] | undefined
      const fundFilter = columnFilters.find(f => f.id === 'fund')?.value as string[] | undefined
      const personalitiesFilter = columnFilters.find(f => f.id === 'personalities')?.value as string[] | undefined

      // Filter by sectors
      if (sectorFilter && sectorFilter.length > 0) {
        if (!company.sector || !sectorFilter.includes(company.sector.id)) {
          return false
        }
      }

      // Filter by funds
      if (fundFilter && fundFilter.length > 0) {
        if (!company.fund || !fundFilter.includes(company.fund.id)) {
          return false
        }
      }

      // Filter by personalities
      if (personalitiesFilter && personalitiesFilter.length > 0) {
        if (!company.personalities || company.personalities.length === 0) {
          return false
        }
        const hasSelectedPersonality = company.personalities.some(personality => 
          personalitiesFilter.includes(personality.id)
        )
        if (!hasSelectedPersonality) {
          return false
        }
      }

      return true
    })
  }, [companies, columnFilters])

  const table = useReactTable({
    data: filteredCompanies,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnFilters: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between py-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex flex-col lg:flex-row items-center gap-2">
            <Input
              placeholder={t('companies.searchPlaceholder')}
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              className="max-w-sm transition-all duration-200 w-80"
            />

            <div className="flex items-center gap-2">
              <FilterSectors
                column={table.getColumn("sector")}
              />
              <FilterPersonalities
                column={table.getColumn("personalities")}
              />
              <FilterFunds
                column={table.getColumn("fund")}
              />
            </div>
          </div>
        </div>
        
        <ShowNumberByPage
          currentLimit={currentLimit}
          onLimitChange={onLimitChange}
        />
        
      </div>
      
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {currentSearch ? t('companies.noResultsForSearch', { search: currentSearch }) : t('companies.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Shadcn/ui pagination component */}
      <div className="py-4">
        <CompaniesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={currentPage < totalPages}
          hasPreviousPage={currentPage > 1}
        />
      </div>
    </div>
  )
}
