import type { Sector } from "@/api/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Layers } from "lucide-react"

interface SectorCardProps {
  sector: Sector
  onClick?: () => void
}

export function SectorCard({ sector, onClick }: SectorCardProps) {
  return (
    <Card
      className={`${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5 text-green-600" />
          {sector.name}
        </CardTitle>
      </CardHeader>
      {sector.description && (
        <CardContent>
          <p className="text-sm text-gray-600">{sector.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
