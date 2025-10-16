import type { Personality } from "@/api/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card"
import { User } from "lucide-react"

interface PersonalityCardProps {
  personality: Personality
  onClick?: () => void
}

export function PersonalityCard({ personality, onClick }: PersonalityCardProps) {
  return (
    <Card
      className={`${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-purple-600" />
          {personality.name}
        </CardTitle>
      </CardHeader>
      {personality.description && (
        <CardContent>
          <p className="text-sm text-gray-600">{personality.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
