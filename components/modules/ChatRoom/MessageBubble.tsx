import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { getParticipantDisplayName } from "@/src/services/chatRoom.service";
import type { ChatMessage } from "@/src/types/chat.types";
import MessageAttachmentCard from "./MessageAttachmentCard";

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId?: string;
}

export default function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwnMessage = currentUserId && message.senderId === currentUserId;

  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center py-2">
        <Badge variant="secondary">{message.text || "System update"}</Badge>
      </div>
    );
  }

  return (
    <div className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] space-y-2 rounded-2xl border px-4 py-3 shadow-sm md:max-w-[70%]",
          isOwnMessage
            ? "border-violet-500 bg-violet-600 text-white"
            : "border-border/60 bg-background",
        )}
      >
        {!isOwnMessage ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            {getParticipantDisplayName(message.sender)}
          </p>
        ) : null}

        {message.text ? (
          <p className={cn("text-sm leading-6", isOwnMessage ? "text-white" : "text-foreground")}>
            {message.text}
          </p>
        ) : null}

        {message.attachment ? <MessageAttachmentCard attachment={message.attachment} /> : null}

        <div
          className={cn(
            "flex items-center justify-end gap-2 text-[11px]",
            isOwnMessage ? "text-white/80" : "text-muted-foreground",
          )}
        >
          <span>{format(new Date(message.createdAt), "p")}</span>
          {message.pending ? <span>Sending…</span> : null}
          {message.failed ? <span>Failed</span> : null}
        </div>
      </div>
    </div>
  );
}
