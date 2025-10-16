import type { Sector } from "@/api/hooks"
import { Link } from "react-router-dom"
import { getIconComponent } from "@/utils/icon-mapper"

interface SectorCardProps {
  sector: Sector
}

export function SectorCard({ sector }: SectorCardProps) {
  const Icon = getIconComponent(sector.icon)

  return (
    <Link
      to={`/sectors/${sector.id}`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-full transition-colors cursor-pointer border border-gray-200"
    >
      <Icon className="h-4 w-4 text-green-600" />
      <span className="text-sm font-medium">{sector.name}</span>
    </Link>
  )
}
