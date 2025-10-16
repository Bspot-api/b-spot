import type { Personality } from "@/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { FundCard, PersonalityCard, SectorCard } from "@/components/shared"
import { CompanyCard } from "@/features/home/components/company-card"
import { usePersonalityCompanies } from "@/hooks/use-personality-companies"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { CompanyCardSkeleton } from "@/features/home/components/company-card-skeleton"
import { ArrowLeft, Building2, Calendar, Layers, TrendingUp, Users } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router-dom"

interface PersonalityDetailProps {
  personality: Personality & {
    funds?: any[]
    sectors?: any[]
    relatedPersonalities?: any[]
  }
}

export function PersonalityDetail({ personality }: PersonalityDetailProps) {
  const {
    data: companiesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCompanies,
  } = usePersonalityCompanies(personality.id)

  const companies = useMemo(() => {
    return companiesData?.pages.flatMap((page) => page.data) || []
  }, [companiesData])

  const totalCompanies = companiesData?.pages[0]?.pagination?.total || 0

  const loadMoreRef = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

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
                <span>{totalCompanies} companies</span>
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

        {/* Related Personalities */}
        {personality.relatedPersonalities && personality.relatedPersonalities.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Related Personalities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personality.relatedPersonalities.map((related: any) => (
                <PersonalityCard key={related.id} personality={related} />
              ))}
            </div>
          </div>
        )}

        {/* Investment Funds */}
        {personality.funds && personality.funds.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Investment Funds
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {personality.funds.map((fund: any) => (
                <FundCard key={fund.id} fund={fund} />
              ))}
            </div>
          </div>
        )}

        {/* Business Sectors */}
        {personality.sectors && personality.sectors.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Business Sectors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personality.sectors.map((sector: any) => (
                <SectorCard key={sector.id} sector={sector} />
              ))}
            </div>
          </div>
        )}

        {/* Companies with Infinite Scroll */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Companies ({totalCompanies})
          </h2>

          {isLoadingCompanies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <CompanyCardSkeleton key={index} />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company: any) => (
                <CompanyCard key={company.id} company={company} />
              ))}

              {/* Loading more skeletons */}
              {isFetchingNextPage && (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CompanyCardSkeleton key={`loading-${index}`} />
                  ))}
                </>
              )}

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="col-span-full h-4" />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No companies found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
