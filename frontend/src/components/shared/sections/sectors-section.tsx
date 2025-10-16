import type { Sector } from "@/api/hooks"
import { SectorCard } from "@/components/shared/sector-card"
import { Layers } from "lucide-react"

interface SectorsSectionProps {
  sectors: Sector[]
  title?: string
}

export function SectorsSection({ sectors, title = "Business Sectors" }: SectorsSectionProps) {
  if (!sectors || sectors.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-green-600" />
        {title} ({sectors.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sector) => (
          <SectorCard key={sector.id} sector={sector} />
        ))}
      </div>
    </div>
  )
}
