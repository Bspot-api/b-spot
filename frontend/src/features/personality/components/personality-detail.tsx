import type { Personality } from "@/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { RelatedPersonalitiesSection } from "@/features/personality/components/related-personalities-section"
import { FundsSection } from "@/features/fund/components/funds-section"
import { SectorsSection } from "@/features/sector/components/sectors-section"
import { CompaniesSection } from "@/features/company/components/companies-section"
import { usePersonalityCompanies } from "@/hooks/use-personality-companies"
import { ArrowLeft, Building2, Calendar, Layers, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router-dom"

interface PersonalityDetailProps {
  personality: Personality & {
    funds?: any[]
    sectors?: any[]
    relatedPersonalities?: any[]
  }
}

export function PersonalityDetail({ personality }: PersonalityDetailProps) {
  const { data: companies = [], isLoading } = usePersonalityCompanies(personality.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to companies
      </Link>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  {personality.name}
                </CardTitle>
                {personality.description && (
                  <CardDescription className="text-base">
                    {personality.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{companies.length} companies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>{personality.funds?.length || 0} funds</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Layers className="h-4 w-4" />
                <span>{personality.sectors?.length || 0} sectors</span>
              </div>
            </div>

            {/* Created date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>
                Added on {new Date(personality.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <RelatedPersonalitiesSection personalities={personality.relatedPersonalities || []} />
        <FundsSection funds={personality.funds || []} />
        <SectorsSection sectors={personality.sectors || []} />
        <CompaniesSection companies={companies} isLoading={isLoading} />
      </div>
    </div>
  )
}
