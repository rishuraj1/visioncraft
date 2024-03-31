import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBadgeProps {
  label: string;
  setSearchBy: React.Dispatch<React.SetStateAction<string>>;
}

export function FilterBadge({ label, setSearchBy }: FilterBadgeProps) {
  return (
    <Badge variant={"outline"} className="gap-1">
      {label}
      <button onClick={() => setSearchBy("")}>
        <X className="ml-auto h-4 w-4" />
      </button>
    </Badge>
  );
}
