import { Card, CardContent, CardHeader } from "@/components/shadcn/card"
import { Skeleton } from "@/components/shadcn/skeleton"

export function CompanyCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-18" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
