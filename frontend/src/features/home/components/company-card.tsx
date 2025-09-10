import type { Company } from "@/api/hooks"
import { Badge } from "@/components/shadcn/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { useTranslation } from "react-i18next"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {company.name}
        </CardTitle>
        {company.description && (
          <CardDescription className="line-clamp-2">
            {company.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Sectors only */}
        {company.sectors && company.sectors.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {t('table.columns.sector')}
            </p>
            <div className="flex flex-wrap gap-1">
              {company.sectors.map((sector) => (
                <Badge
                  key={sector.id}
                  variant="outline"
                  className="text-xs"
                >
                  {sector.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            {t('table.values.noDetails')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
