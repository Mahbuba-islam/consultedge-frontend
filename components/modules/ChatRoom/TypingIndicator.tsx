import { Loader2 } from "lucide-react";

interface TypingIndicatorProps {
  names?: string[];
}

export default function TypingIndicator({ names = [] }: TypingIndicatorProps) {
  if (!names.length) {
    return <div className="min-h-5" />;
  }

  const label =
    names.length === 1
      ? `${names[0]} is typing…`
      : `${names.slice(0, 2).join(", ")} are typing…`;

  return (
    <div className="flex min-h-5 items-center gap-2 text-xs text-muted-foreground">
      <Loader2 className="size-3.5 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
