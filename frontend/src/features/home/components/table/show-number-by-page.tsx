import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn";

export interface ShowNumberByPageProps {
  currentLimit: number
  onLimitChange: (limit: number) => void
}

export function ShowNumberByPage({ currentLimit, onLimitChange }: ShowNumberByPageProps) {
  return (
    <div className="lg:flex items-center gap-2 hidden">
      <span className="text-sm text-gray-600">Afficher :</span>
      <Select 
        value={(currentLimit || 30).toString()} 
        onValueChange={(value) => onLimitChange(parseInt(value))}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600">par page</span>
    </div>
  )
}