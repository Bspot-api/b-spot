import type { Company } from "@/api/hooks"
import { Button } from "@/components/shadcn/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ExternalLink } from "lucide-react"

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
            <span className="text-gray-400">Non spécifié</span>
          )}
        </div>
      )
    },
  },
]
