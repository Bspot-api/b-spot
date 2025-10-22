import type { Personality } from "@/api/hooks"
import { Section } from "@/components/shared/sections/section"
import { Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { PersonalityCard } from "./personality-card"

interface RelatedPersonalitiesSectionProps {
  personalities: Personality[]
  title?: string
}

export function RelatedPersonalitiesSection({
  personalities,
  title,
}: RelatedPersonalitiesSectionProps) {
  const { t } = useTranslation()
  const sectionTitle = title || t('sections.relatedPersonalities')
  
  if (!personalities || personalities.length === 0) return null

  return (
    <Section icon={Users} iconColor="text-purple-600" title={sectionTitle} count={personalities.length}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personalities.map((personality) => (
          <PersonalityCard key={personality.id} personality={personality} />
        ))}
      </div>
    </Section>
  )
}
