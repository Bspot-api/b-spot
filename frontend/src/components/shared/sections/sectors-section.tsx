import type { Sector } from "@/api/hooks"
import { SectorCard } from "@/components/shared/sector-card"
import { Section } from "./section"
import { Layers } from "lucide-react"

interface SectorsSectionProps {
  sectors: Sector[]
  title?: string
}

export function SectorsSection({ sectors, title = "Business Sectors" }: SectorsSectionProps) {
  if (!sectors || sectors.length === 0) return null

  return (
    <Section icon={Layers} iconColor="text-green-600" title={title} count={sectors.length}>
      <div className="flex flex-wrap gap-2">
        {sectors.map((sector) => (
          <SectorCard key={sector.id} sector={sector} />
        ))}
      </div>
    </Section>
  )
}
