import { AppVersion, Header } from "@/components/shared"
import { CompanyDetail } from "@/features/company/components/company-detail"
import { useCompany } from "@/hooks/use-company"
import { useParams } from "react-router-dom"

export function CompanyPage() {
  const { id } = useParams<{ id: string }>()
  const { data: company, isLoading, error } = useCompany(id!)

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading company details...</p>
            </div>
          </div>
        </div>
        <AppVersion />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company not found</h2>
              <p className="text-gray-600 mb-4">
                The company you're looking for doesn't exist or has been removed.
              </p>
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Back to companies
              </a>
            </div>
          </div>
        </div>
        <AppVersion />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <CompanyDetail company={company} />
      <AppVersion />
    </div>
  )
}
