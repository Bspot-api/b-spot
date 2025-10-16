import { useParams } from "react-router-dom"
import { PersonalityDetail } from "@/features/personality/components/personality-detail"
import { usePersonality } from "@/hooks/use-personality"

export function PersonalityDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: personality, isLoading, error } = usePersonality(id!)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">Error loading personality</div>
        </div>
      </div>
    )
  }

  if (!personality) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Personality not found</div>
        </div>
      </div>
    )
  }

  return <PersonalityDetail personality={personality} />
}
