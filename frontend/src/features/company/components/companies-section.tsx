import type { Company } from "@/api/hooks"
import { EntityGrid } from "@/components/shared/entity-grid"
import { Section } from "@/components/shared/sections/section"
import { CompanyCard } from "@/features/home/components/company-card"
import { CompanyCardSkeleton } from "@/features/home/components/company-card-skeleton"
import { Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"

interface CompaniesSectionProps {
  companies: Company[]
  isLoading?: boolean
  title?: string
}

export function CompaniesSection({
  companies,
  isLoading = false,
  title,
}: CompaniesSectionProps) {
  const { t } = useTranslation()
  const sectionTitle = title || t('sections.companies')

  return (
    <Section icon={Building2} iconColor="text-gray-600" title={sectionTitle} count={companies.length}>
      {isLoading ? (
        <EntityGrid>
          {Array.from({ length: 6 }).map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </EntityGrid>
      ) : companies.length > 0 ? (
        <EntityGrid>
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </EntityGrid>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('companies.noResults')}</p>
        </div>
      )}
    </Section>
  )
}
