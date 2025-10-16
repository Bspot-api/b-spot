import type { Personality } from "@/api/hooks"
import { PersonalityCard } from "@/components/shared/personality-card"
import { Section } from "./section"
import { Users } from "lucide-react"

interface RelatedPersonalitiesSectionProps {
  personalities: Personality[]
  title?: string
}

export function RelatedPersonalitiesSection({
  personalities,
  title = "Related Personalities",
}: RelatedPersonalitiesSectionProps) {
  if (!personalities || personalities.length === 0) return null

  return (
    <Section icon={Users} iconColor="text-purple-600" title={title} count={personalities.length}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personalities.map((personality) => (
          <PersonalityCard key={personality.id} personality={personality} />
        ))}
      </div>
    </Section>
  )
}
