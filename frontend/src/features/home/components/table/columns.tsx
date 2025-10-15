import type { Company } from "@/types/relation"
import { Button } from "@/components/shadcn/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useTranslation } from "react-i18next"

export const useCompanyColumns = (): ColumnDef<Company>[] => {
  const { t } = useTranslation();
  
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            {t('table.columns.companyName')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const company = row.original
        return (
          <div className="font-medium">
            {company.name}
          </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: t('table.columns.description'),
      cell: ({ row }) => {
        const description = row.original.description
        return (
          <div className="text-sm text-gray-600 max-w-xs">
            {description ? (
              <span className="line-clamp-2">{description}</span>
            ) : (
              <span className="text-gray-400">{t('table.values.noDescription')}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "fund",
      header: t('table.columns.fund'),
      enableColumnFilter: true,
      id: "fund",
      filterFn: (row, id, value) => {
        const fund = row.getValue(id) as { id: string } | null;
        return fund && value.includes(fund.id);
      },
      cell: ({ row }) => {
        const fund = row.original.fund
        return (
          <div className="text-sm">
            {fund ? (
              <span className="font-medium text-gray-900">{fund.name}</span>
            ) : (
              <span className="text-gray-400">{t('table.values.notSpecified')}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "personalities",
      header: t('table.columns.personalities'),
      enableColumnFilter: true,
      id: "personalities",
      filterFn: (row, id, value) => {
        const personalities = row.getValue(id) as Array<{ id: string }> | null;
        return value.some((v: string) => 
          personalities?.some((p) => p.id === v)
        );
      },
      cell: ({ row }) => {
        const personalities = row.original.personalities
        return (
          <div className="text-sm">
            {personalities && personalities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {personalities.map((personality) => (
                  <span
                    key={personality.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {personality.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">{t('table.values.noPersonalities')}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "sector",
      header: t('table.columns.sector'),
      enableColumnFilter: true,
      id: "sector",
      filterFn: (row, id, value) => {
        const sector = row.getValue(id) as { id: string } | null;
        return sector && value.includes(sector.id);
      },
      cell: ({ row }) => {
        const sector = row.original.sector
        return (
          <div className="text-sm">
            {sector ? (
              <span className="text-gray-700">{sector.name}</span>
            ) : (
              <span className="text-gray-400">{t('table.values.notSpecified')}</span>
            )}
          </div>
        )
      },
    },
  ]
}

// Create a component that provides columns with translations
export function CompanyColumnsProvider({ children }: { children: React.ReactNode }) {
  const columns = useCompanyColumns();
  return children;
}

// Export a function to get columns (to be used in components that need translations)
export function getCompanyColumns(): ColumnDef<Company>[] {
  // This will be used by components that don't have access to useTranslation
  // For now, return a basic version - in practice, you'd want to handle this differently
  return [
    {
      accessorKey: "name",
      header: "Company Name",
      cell: ({ row }) => {
        const company = row.original
        return (
          <div className="font-medium">
            {company.name}
          </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description
        return (
          <div className="text-sm text-gray-600 max-w-xs">
            {description ? (
              <span className="line-clamp-2">{description}</span>
            ) : (
              <span className="text-gray-400">No description</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "fund",
      header: "Investment Fund",
      enableColumnFilter: true,
      id: "fund",
      filterFn: (row, id, value) => {
        const fund = row.getValue(id) as { id: string } | null;
        return fund && value.includes(fund.id);
      },
      cell: ({ row }) => {
        const fund = row.original.fund
        return (
          <div className="text-sm">
            {fund ? (
              <span className="font-medium text-gray-900">{fund.name}</span>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "personalities",
      header: "Involved Personalities",
      enableColumnFilter: true,
      id: "personalities",
      filterFn: (row, id, value) => {
        const personalities = row.getValue(id) as Array<{ id: string }> | null;
        return value.some((v: string) => 
          personalities?.some((p) => p.id === v)
        );
      },
      cell: ({ row }) => {
        const personalities = row.original.personalities
        return (
          <div className="text-sm">
            {personalities && personalities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {personalities.map((personality) => (
                  <span
                    key={personality.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {personality.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">No personalities</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "sector",
      header: "Sector",
      enableColumnFilter: true,
      id: "sector",
      filterFn: (row, id, value) => {
        const sector = row.getValue(id) as { id: string } | null;
        return sector && value.includes(sector.id);
      },
      cell: ({ row }) => {
        const sector = row.original.sector
        return (
          <div className="text-sm">
            {sector ? (
              <span className="text-gray-700">{sector.name}</span>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )}
          </div>
        )
      },
    },
  ]
}
