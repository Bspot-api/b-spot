import type { Personality } from "@/api/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

interface PersonalityCardProps {
  personality: Personality
}

export function PersonalityCard({ personality }: PersonalityCardProps) {
  return (
    <Link to={`/personalities/${personality.id}`} className="block h-full">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
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
    </Link>
  )
}
