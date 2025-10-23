import type { Personality } from "@/api/hooks"
import { EntityGrid } from "@/components/shared/entity-grid"
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
      <EntityGrid>
        {personalities.map((personality) => (
          <PersonalityCard key={personality.id} personality={personality} />
        ))}
      </EntityGrid>
    </Section>
  )
}
