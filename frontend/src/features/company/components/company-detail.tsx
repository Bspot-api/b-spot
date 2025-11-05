import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { FundsSection } from "@/features/fund/components/funds-section"
import { RelatedPersonalitiesSection } from "@/features/personality/components/related-personalities-section"
import { SectorsSection } from "@/features/sector/components/sectors-section"
import type { Company } from "@/types/relation"
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

interface CompanyDetailProps {
  company: Company
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
{t('details.backToCompanies')}
      </Link>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl font-bold">{company.name}</CardTitle>
                {company.description && (
                  <CardDescription className="text-base">
                    {company.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Source link */}
            {company.source && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <a
                  href={company.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {company.source}
                </a>
              </div>
            )}

            {/* Created date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>
                {t('details.addedOn')} {new Date(company.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>


        <FundsSection funds={company.funds || []} />
        <SectorsSection sectors={company.sectors || []} />
        <RelatedPersonalitiesSection
          personalities={company.personalities || []}
          title="Involved Personalities"
        />
      </div>
    </div>
  )
}
