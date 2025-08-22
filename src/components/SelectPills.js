import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SelectorPills({ pills, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((c) => (
        <Badge
          key={c}
          variant={active === c ? "default" : "secondary"}
          className={cn(
            "cursor-pointer rounded-2xl px-3 py-1 text-sm transition",
            active === c && "shadow"
          )}
          onClick={() => onChange(c)}
        >
          {c}
        </Badge>
      ))}
    </div>
  );
}