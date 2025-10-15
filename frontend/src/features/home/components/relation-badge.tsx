import { Badge } from "@/components/shadcn/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip"
import type { RelationMatch } from "@/types/relation"
import {
  Briefcase,
  Building2,
  Link2,
  TrendingUp,
  User,
  Users,
} from "lucide-react"

interface RelationBadgeProps {
  match: RelationMatch
}

const getFilterTypeColor = (filterType: RelationMatch["filterType"]) => {
  switch (filterType) {
    case "fund":
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
    case "sector":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    case "personality":
      return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
  }
}

const getRelationTypeIcon = (relationType: RelationMatch["relationType"]) => {
  const iconClass = "h-3 w-3"

  switch (relationType) {
    case "invests_in":
      return <TrendingUp className={iconClass} />
    case "operates_in":
      return <Building2 className={iconClass} />
    case "founded":
      return <Briefcase className={iconClass} />
    case "leads":
      return <User className={iconClass} />
    case "works_at":
      return <Users className={iconClass} />
    case "is_connected_to":
      return <Link2 className={iconClass} />
    default:
      return <Link2 className={iconClass} />
  }
}

const getRelationTypeLabel = (relationType: RelationMatch["relationType"]) => {
  return relationType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

export function RelationBadge({ match }: RelationBadgeProps) {
  const tooltipContent = (
    <div className="space-y-1 text-xs">
      <p>
        <strong>Filter:</strong> {match.filterName}
      </p>
      <p>
        <strong>Relation:</strong> {getRelationTypeLabel(match.relationType)}
      </p>
      {match.via && (
        <p>
          <strong>Via:</strong> {match.via === "direct" ? "Direct" : match.viaEntityName || "Fund"}
        </p>
      )}
    </div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${getFilterTypeColor(match.filterType)} cursor-help transition-colors`}
          >
            {getRelationTypeIcon(match.relationType)}
            <span>{match.filterName}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
