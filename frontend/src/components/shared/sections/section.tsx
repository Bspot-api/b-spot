import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface SectionProps {
  icon: LucideIcon
  iconColor: string
  title: string
  count?: number
  children: ReactNode
}

export function Section({ icon: Icon, iconColor, title, count, children }: SectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
        {count !== undefined && ` (${count})`}
      </h2>
      {children}
    </div>
  )
}
