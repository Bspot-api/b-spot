import type { Sector } from "@/api/hooks"
import { Section } from "@/components/shared/sections/section"
import { Layers } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SectorCard } from "./sector-card"

interface SectorsSectionProps {
  sectors: Sector[]
  title?: string
}

export function SectorsSection({ sectors, title }: SectorsSectionProps) {
  const { t } = useTranslation()
  const sectionTitle = title || t('sections.businessSectors')
  
  if (!sectors || sectors.length === 0) return null

  return (
    <Section icon={Layers} iconColor="text-green-600" title={sectionTitle} count={sectors.length}>
      <div className="flex flex-wrap gap-2">
        {sectors.map((sector) => (
          <SectorCard key={sector.id} sector={sector} />
        ))}
      </div>
    </Section>
  )
}
