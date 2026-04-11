import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/src/lib/utils";

interface PresenceBadgeProps {
  isOnline?: boolean;
  lastSeen?: string | null;
  className?: string;
}

export default function PresenceBadge({
  isOnline = false,
  lastSeen,
  className,
}: PresenceBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-2 rounded-full border px-2.5 py-1 text-xs",
        isOnline ? "border-emerald-200 text-emerald-700" : "border-slate-200 text-slate-600",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isOnline ? "bg-emerald-500" : "bg-slate-400",
        )}
      />
      {isOnline
        ? "Online"
        : lastSeen
          ? `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`
          : "Offline"}
    </Badge>
  );
}
