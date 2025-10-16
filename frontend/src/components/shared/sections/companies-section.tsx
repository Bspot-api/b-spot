import type { Company } from "@/api/hooks"
import { CompanyCard } from "@/features/home/components/company-card"
import { CompanyCardSkeleton } from "@/features/home/components/company-card-skeleton"
import { Section } from "./section"
import { Building2 } from "lucide-react"

interface CompaniesSectionProps {
  companies: Company[]
  isLoading?: boolean
  title?: string
}

export function CompaniesSection({
  companies,
  isLoading = false,
  title = "Companies",
}: CompaniesSectionProps) {
  return (
    <Section icon={Building2} iconColor="text-gray-600" title={title} count={companies.length}>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No companies found</p>
        </div>
      )}
    </Section>
  )
}
