import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

export function getIconComponent(iconName?: string): LucideIcon {
  if (!iconName) {
    return LucideIcons.Layers
  }

  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[iconName]

  return IconComponent || LucideIcons.Layers
}
