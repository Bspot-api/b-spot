import type { Fund } from "@/api/hooks"
import { FundCard } from "@/components/shared/fund-card"
import { Section } from "./section"
import { TrendingUp } from "lucide-react"

interface FundsSectionProps {
  funds: Fund[]
  title?: string
}

export function FundsSection({ funds, title = "Investment Funds" }: FundsSectionProps) {
  if (!funds || funds.length === 0) return null

  return (
    <Section icon={TrendingUp} iconColor="text-blue-600" title={title} count={funds.length}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funds.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>
    </Section>
  )
}
