import type { Company } from "@/types/relation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { FundCard, PersonalityCard, SectorCard } from "@/components/shared"
import { RelationBadge } from "@/features/home/components/relation-badge"
import { ArrowLeft, Building2, Calendar, ExternalLink, Layers, Tag, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

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
        Back to companies
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
                Added on {new Date(company.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Relation Matches Card (if filters active) */}
        {company.matchedVia && company.matchedVia.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Matched Relations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.matchedVia.map((match, index) => (
                  <RelationBadge key={`${match.filterId}-${index}`} match={match} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investment Funds */}
        {company.funds && company.funds.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Investment Funds
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {company.funds.map((fund) => (
                <FundCard key={fund.id} fund={fund} />
              ))}
            </div>
          </div>
        )}

        {/* Business Sectors */}
        {company.sectors && company.sectors.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Business Sectors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.sectors.map((sector) => (
                <SectorCard key={sector.id} sector={sector} />
              ))}
            </div>
          </div>
        )}

        {/* Involved Personalities */}
        {company.personalities && company.personalities.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Involved Personalities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.personalities.map((personality) => (
                <PersonalityCard key={personality.id} personality={personality} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
