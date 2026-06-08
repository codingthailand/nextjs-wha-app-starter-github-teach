import type { Period } from "@/types/admin"
import { cn } from "@/lib/utils"

const options: { label: string; value: Period }[] = [
  { label: "7 วัน", value: "7d" },
  { label: "30 วัน", value: "30d" },
  { label: "90 วัน", value: "90d" },
]

export function PeriodSelector({
  value,
  onChange,
}: {
  value: Period
  onChange: (value: Period) => void
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
