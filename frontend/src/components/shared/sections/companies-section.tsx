import type { Company } from "@/api/hooks"
import { CompanyCard } from "@/features/home/components/company-card"
import { CompanyCardSkeleton } from "@/features/home/components/company-card-skeleton"
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
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-gray-600" />
        {title} ({companies.length})
      </h2>

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
    </div>
  )
}
