import Link from "next/link";
import { MessageCircleMore, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ChatEmptyStateProps {
  expertId?: string;
  isLoading?: boolean;
  dashboardHref?: string;
}

export default function ChatEmptyState({
  expertId,
  isLoading = false,
  dashboardHref = "/dashboard",
}: ChatEmptyStateProps) {
  return (
    <Card className="flex h-full items-center justify-center border-dashed bg-linear-to-br from-violet-50/70 via-background to-sky-50/70 shadow-sm">
      <CardContent className="max-w-xl space-y-4 py-14 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <MessageCircleMore className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {isLoading
              ? "Preparing your conversations"
              : expertId
                ? "Opening your expert conversation"
                : "Your messages hub is ready"}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            {expertId
              ? "We’re looking for the matching room so you can message this expert from one polished dashboard workspace."
              : "Choose a room from the sidebar to continue a conversation, share files, or start a secure video call."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/experts">
              <Sparkles className="mr-2 size-4" />
              Explore experts
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href={dashboardHref}>Back to dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
