"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ExternalLink, Search } from "lucide-react"
import React from "react"

import type { Company } from "@/api/hooks"
import { useDebounce } from "@/hooks/use-debounce"
import { useSectors } from "@/hooks/use-sectors"

import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { CompaniesPagination } from "./companies-pagination"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

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

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Nom de l'entreprise
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="font-medium">
          <a
            href={company.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {company.name}
            <ExternalLink className="ml-1 h-3 w-3 inline" />
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: "fund",
    header: "Fond d'investissement",
    enableColumnFilter: true,
    id: "fund",
    filterFn: (row, id, value) => {
      const fund = row.getValue(id) as any;
      return fund && value.includes(fund.id);
    },
    cell: ({ row }) => {
      const fund = row.original.fund
      return (
        <div className="text-sm">
          {fund ? (
            <span className="font-medium text-gray-900">{fund.name}</span>
          ) : (
            <span className="text-gray-400">Non spécifié</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "personalities",
    header: "Personnalités impliquées",
    enableColumnFilter: true,
    id: "personalities",
    filterFn: (row, id, value) => {
      const personalities = row.getValue(id) as any[];
      return value.some((v: string) => 
        personalities?.some((p: any) => p.id === v)
      );
    },
    cell: ({ row }) => {
      const personalities = row.original.personalities
      return (
        <div className="text-sm">
          {personalities && personalities.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {personalities.map((personality, index) => (
                <span
                  key={personality.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {personality.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">Aucune personnalité</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "sector",
    header: "Secteur",
    enableColumnFilter: true,
    id: "sector",
    filterFn: (row, id, value) => {
      const sector = row.getValue(id) as any;
      return sector && value.includes(sector.id);
    },
    cell: ({ row }) => {
      const sector = row.original.sector
      return (
        <div className="text-sm">
          {sector ? (
            <span className="text-gray-700">{sector.name}</span>
          ) : (
            <span className="text-gray-400">Non spécifié</span>
          )}
        </div>
      )
    },
  },
]

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
  // Safety check to ensure all required props are valid
  if (typeof currentPage !== 'number' || typeof totalPages !== 'number' || typeof currentLimit !== 'number') {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-600">Chargement des paramètres...</p>
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

  // Fetch sectors for the filter
  const { data: sectors = [], isLoading: sectorsLoading } = useSectors()

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
    columns,
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
      {/* Filters */}
      <div className="flex items-center gap-2 py-4 border-b">
        <DataTableFacetedFilter
          column={table.getColumn("sector")}
          title="Sectors"
          options={sectors.map(sector => ({
            label: sector.name,
            value: sector.id,
          }))}
          loading={sectorsLoading}
        />
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une entreprise..."
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              className="pl-10 max-w-sm transition-all duration-200"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Afficher :</span>
          <Select 
            value={(currentLimit || 30).toString()} 
            onValueChange={(value) => onLimitChange(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">par page</span>
        </div>
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
                  {currentSearch ? `Aucune entreprise trouvée pour "${currentSearch}"` : 'Aucune entreprise trouvée.'}
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
