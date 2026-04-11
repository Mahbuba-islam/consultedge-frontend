import { format } from "date-fns";
import { CalendarDays, Loader2, RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/src/lib/utils";
import type { IAvailabilitySlot, IExpertAvailability } from "@/src/types/expert.types";
import PublishedAvailabilityPanel, { type DateGroup } from "./PublishedAvailabilityPanel";

type AvailabilityManagePanelProps = {
  catalogGroups: DateGroup<IAvailabilitySlot>[];
  availabilityGroups: DateGroup<IExpertAvailability>[];
  selectedScheduleIds: string[];
  publishedScheduleIds: Set<string>;
  customAvailability: {
    date: string;
    startTime: string;
    endTime: string;
  };
  availabilityMessage?: string | null;
  isCatalogLoading: boolean;
  isCatalogError: boolean;
  isPublishing: boolean;
  isCreating: boolean;
  isMyAvailabilityLoading: boolean;
  isDeleting: boolean;
  onCustomAvailabilityChange: (field: "date" | "startTime" | "endTime", value: string) => void;
  onRefreshCatalog: () => void;
  onToggleSchedule: (scheduleId: string) => void;
  onClearSelection: () => void;
  onPublishSelected: () => void;
  onCreateCustomSlot: () => void;
  onDeletePublished: (scheduleId: string) => void;
  onRefreshPublished: () => void;
  formatTimeRange: (startValue?: string | null, endValue?: string | null) => string;
};

export default function AvailabilityManagePanel({
  catalogGroups,
  availabilityGroups,
  selectedScheduleIds,
  publishedScheduleIds,
  customAvailability,
  availabilityMessage,
  isCatalogLoading,
  isCatalogError,
  isPublishing,
  isCreating,
  isMyAvailabilityLoading,
  isDeleting,
  onCustomAvailabilityChange,
  onRefreshCatalog,
  onToggleSchedule,
  onClearSelection,
  onPublishSelected,
  onCreateCustomSlot,
  onDeletePublished,
  onRefreshPublished,
  formatTimeRange,
}: AvailabilityManagePanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-violet-200/70 shadow-lg shadow-violet-500/5">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge className="mb-2 bg-violet-100 text-violet-700 hover:bg-violet-100">
                <Sparkles className="mr-1 size-3.5" />
                Create slots
              </Badge>
              <CardTitle>Choose schedule blocks</CardTitle>
              <CardDescription>
                Select from the schedule catalog and publish the slots you want clients to book.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRefreshCatalog}
                className="border-violet-200 text-violet-700"
              >
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-violet-200/70 bg-linear-to-r from-violet-50 via-white to-fuchsia-50 p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-violet-800">Create a custom slot</p>
                <p className="text-sm text-muted-foreground">
                  Add a brand-new availability window and publish it instantly.
                </p>
              </div>
              <Badge className="bg-white text-violet-700">Direct create</Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                value={customAvailability.date}
                onChange={(event) => onCustomAvailabilityChange("date", event.target.value)}
              />
              <Input
                type="time"
                value={customAvailability.startTime}
                onChange={(event) =>
                  onCustomAvailabilityChange("startTime", event.target.value)
                }
              />
              <Input
                type="time"
                value={customAvailability.endTime}
                onChange={(event) => onCustomAvailabilityChange("endTime", event.target.value)}
              />
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                className="bg-violet-600 hover:bg-violet-700"
                disabled={isCreating}
                onClick={onCreateCustomSlot}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating slot...
                  </>
                ) : (
                  "Create & publish slot"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-violet-50/60 px-4 py-3">
            <p className="text-sm text-violet-800">
              <strong>{selectedScheduleIds.length}</strong> slot
              {selectedScheduleIds.length === 1 ? "" : "s"} selected for publishing.
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!selectedScheduleIds.length}
                onClick={onClearSelection}
              >
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
                disabled={!selectedScheduleIds.length || isPublishing}
                onClick={onPublishSelected}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish selected slots"
                )}
              </Button>
            </div>
          </div>

          {isCatalogError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Could not load the schedule catalog. Make sure your backend exposes
              <code className="mx-1 rounded bg-white px-1 py-0.5">GET /schedules</code>
              for expert availability setup.
            </div>
          ) : null}

          {availabilityMessage ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              {availabilityMessage}
            </div>
          ) : null}

          {isCatalogLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : catalogGroups.length > 0 ? (
            <div className="space-y-4">
              {catalogGroups.map((group) => (
                <div key={group.key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-violet-700" />
                    <p className="font-medium text-foreground">{group.label}</p>
                    <Badge variant="outline">{group.items.length} slots</Badge>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.items.map((slot) => {
                      const isLive = publishedScheduleIds.has(slot.id);
                      const isSelected = selectedScheduleIds.includes(slot.id);

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isLive}
                          onClick={() => onToggleSchedule(slot.id)}
                          className={cn(
                            "rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                            isLive
                              ? "cursor-not-allowed border-emerald-200 bg-emerald-50 text-emerald-800"
                              : isSelected
                                ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-500/15"
                                : "border-violet-200 bg-white hover:border-violet-300 hover:bg-violet-50",
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">
                                {formatTimeRange(slot.startDateTime, slot.endDateTime)}
                              </p>
                              <p className="text-xs opacity-80">Slot ID: {slot.id.slice(0, 8)}...</p>
                            </div>

                            <Badge
                              className={cn(
                                isLive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : isSelected
                                    ? "bg-white/15 text-white"
                                    : "bg-violet-100 text-violet-700",
                              )}
                            >
                              {isLive ? "Live" : isSelected ? "Selected" : "Add"}
                            </Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              No reusable schedule catalog items are available yet. You can still use the
              <strong className="mx-1 text-foreground">Create a custom slot</strong>
              section above to publish your own availability.
            </div>
          )}
        </CardContent>
      </Card>

      <PublishedAvailabilityPanel
        groups={availabilityGroups}
        isLoading={isMyAvailabilityLoading}
        isDeleting={isDeleting}
        onDelete={onDeletePublished}
        onRefresh={onRefreshPublished}
        formatTimeRange={formatTimeRange}
      />
    </div>
  );
}
