import type { Fund } from "@/api/hooks"
import { FundCard } from "@/components/shared/fund-card"
import { TrendingUp } from "lucide-react"

interface FundsSectionProps {
  funds: Fund[]
  title?: string
}

export function FundsSection({ funds, title = "Investment Funds" }: FundsSectionProps) {
  if (!funds || funds.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        {title} ({funds.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funds.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>
    </div>
  )
}
