import type { Fund } from "@/api/hooks"
import { EntityGrid } from "@/components/shared/entity-grid"
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
      <EntityGrid>
        {funds.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </EntityGrid>
    </Section>
  )
}
