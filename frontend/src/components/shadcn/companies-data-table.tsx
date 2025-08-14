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
import { ArrowUpDown, ExternalLink } from "lucide-react"
import React from "react"

import type { Company } from "@/api/hooks"
import { CompaniesPagination } from "../ui/companies-pagination"
import { Button } from "./button"
import { Input } from "./input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

export interface CompaniesDataTableProps {
  companies: Company[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
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

export function CompaniesDataTable({ companies, currentPage, totalPages, onPageChange }: CompaniesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data: companies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par nom d'entreprise..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
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
                  Aucune entreprise trouvée.
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
