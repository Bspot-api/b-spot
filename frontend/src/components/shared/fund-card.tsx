import type { Fund } from "@/api/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Building2 } from "lucide-react"

interface FundCardProps {
  fund: Fund
  onClick?: () => void
}

export function FundCard({ fund, onClick }: FundCardProps) {
  return (
    <Card
      className={`${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          {fund.name}
        </CardTitle>
      </CardHeader>
      {fund.description && (
        <CardContent>
          <p className="text-sm text-gray-600">{fund.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
