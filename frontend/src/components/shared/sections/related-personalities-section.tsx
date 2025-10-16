import type { Personality } from "@/api/hooks"
import { PersonalityCard } from "@/components/shared/personality-card"
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
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-purple-600" />
        {title} ({personalities.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personalities.map((personality) => (
          <PersonalityCard key={personality.id} personality={personality} />
        ))}
      </div>
    </div>
  )
}
