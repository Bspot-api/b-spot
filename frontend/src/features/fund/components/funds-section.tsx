import type { Fund } from "@/api/hooks"
import { Section } from "@/components/shared/sections/section"
import { TrendingUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import { FundCard } from "./fund-card"

interface FundsSectionProps {
  funds: Fund[]
  title?: string
}

export function FundsSection({ funds, title }: FundsSectionProps) {
  const { t } = useTranslation()
  const sectionTitle = title || t('sections.investmentFunds')
  
  if (!funds || funds.length === 0) return null

  return (
    <Section icon={TrendingUp} iconColor="text-blue-600" title={sectionTitle} count={funds.length}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funds.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>
    </Section>
  )
}
