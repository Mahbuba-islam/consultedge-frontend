import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/src/lib/utils";
import type { IExpertAvailability } from "@/src/types/expert.types";

export type DateGroup<T> = {
  key: string;
  label: string;
  items: T[];
};

type PublishedAvailabilityPanelProps = {
  groups: DateGroup<IExpertAvailability>[];
  isLoading: boolean;
  isDeleting: boolean;
  availabilityMessage?: string | null;
  showHeaderCta?: boolean;
  onDelete: (scheduleId: string) => void;
  onRefresh: () => void;
  formatTimeRange: (startValue?: string | null, endValue?: string | null) => string;
};

export default function PublishedAvailabilityPanel({
  groups,
  isLoading,
  isDeleting,
  availabilityMessage,
  showHeaderCta = false,
  onDelete,
  onRefresh,
  formatTimeRange,
}: PublishedAvailabilityPanelProps) {
  return (
    <Card className="border-violet-200/70 shadow-lg shadow-violet-500/5">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge
              className={cn(
                "mb-2 w-fit hover:bg-fuchsia-100",
                showHeaderCta
                  ? "bg-violet-100 text-violet-700 hover:bg-violet-100"
                  : "bg-fuchsia-100 text-fuchsia-700",
              )}
            >
              <CheckCircle2 className="mr-1 size-3.5" />
              {showHeaderCta ? "My Schedule" : "Live view"}
            </Badge>
            <CardTitle>
              {showHeaderCta ? "Upcoming availability" : "Your published availability"}
            </CardTitle>
            <CardDescription>
              {showHeaderCta
                ? "Review the slots you have already published and keep your calendar fresh."
                : "Monitor active slots, see booked ones, and remove unbooked availability when needed."}
            </CardDescription>
          </div>

          {showHeaderCta ? (
            <Button asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href="/expert/dashboard/set-availability">Create slots</Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        {availabilityMessage ? (
          <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
            {availabilityMessage}
          </div>
        ) : null}

        <AvailabilityList
          groups={groups}
          isLoading={isLoading}
          isDeleting={isDeleting}
          onDelete={onDelete}
          onRefresh={onRefresh}
          formatTimeRange={formatTimeRange}
        />
      </CardContent>
    </Card>
  );
}

type AvailabilityListProps = {
  groups: DateGroup<IExpertAvailability>[];
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (scheduleId: string) => void;
  onRefresh: () => void;
  formatTimeRange: (startValue?: string | null, endValue?: string | null) => string;
};

function AvailabilityList({
  groups,
  isLoading,
  isDeleting,
  onDelete,
  onRefresh,
  formatTimeRange,
}: AvailabilityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-8 text-center">
        <p className="text-lg font-semibold text-foreground">No availability published yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first available slot to start receiving consultation bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="mr-2 size-4" />
          Refresh list
        </Button>
      </div>

      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-violet-700" />
            <p className="font-medium text-foreground">{group.label}</p>
            <Badge variant="outline">{group.items.length} items</Badge>
          </div>

          <div className="space-y-2">
            {group.items.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-violet-700" />
                    <p className="font-medium text-foreground">
                      {formatTimeRange(slot.schedule?.startDateTime, slot.schedule?.endDateTime)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Status: {slot.isBooked ? "Booked by a client" : "Available for booking"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      slot.isBooked
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-violet-100 text-violet-700",
                    )}
                  >
                    {slot.isBooked ? "Booked" : "Open"}
                  </Badge>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={slot.isBooked || isDeleting}
                    onClick={() => onDelete(slot.scheduleId)}
                  >
                    {isDeleting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
