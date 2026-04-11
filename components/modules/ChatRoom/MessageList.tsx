"use client";

import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatMessage } from "@/src/types/chat.types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isLoading?: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  isLoading = false,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 px-4 py-4 md:px-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <Skeleton className="h-20 w-[75%] rounded-2xl" />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation below.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
          ))
        )}

        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
