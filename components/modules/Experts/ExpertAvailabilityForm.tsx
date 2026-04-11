"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, parseISO } from "date-fns";
import { toast } from "sonner";

import AvailabilityManagePanel from "@/components/modules/Experts/AvailabilityManagePanel";
import PublishedAvailabilityPanel, {
  type DateGroup,
} from "@/components/modules/Experts/PublishedAvailabilityPanel";
import { Card, CardContent } from "@/components/ui/card";
import {
  createScheduleSlot,
  deleteExpertAvailability,
  getMyExpertAvailability,
  getScheduleCatalog,
  publishExpertAvailability,
} from "@/src/services/expertAvailability";
import type { IAvailabilitySlot, IExpertAvailability } from "@/src/types/expert.types";

type ExpertAvailabilityFormProps = {
  mode?: "manage" | "overview";
};

const formatTimeRange = (startValue?: string | null, endValue?: string | null) => {
  if (!startValue) return "Time unavailable";

  const start = parseISO(startValue);
  const end = endValue ? parseISO(endValue) : null;

  return end
    ? `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
    : format(start, "h:mm a");
};

const groupByDate = <T,>(
  items: T[],
  getStartDate: (item: T) => string | null | undefined,
): DateGroup<T>[] => {
  const grouped = new Map<string, DateGroup<T>>();

  for (const item of items) {
    const startValue = getStartDate(item);
    if (!startValue) continue;

    const parsed = parseISO(startValue);
    const key = format(parsed, "yyyy-MM-dd");
    const existing = grouped.get(key);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    grouped.set(key, {
      key,
      label: format(parsed, "EEEE, MMM d"),
      items: [item],
    });
  }

  return [...grouped.values()].sort((left, right) => left.key.localeCompare(right.key));
};

export default function ExpertAvailabilityForm({
  mode = "manage",
}: ExpertAvailabilityFormProps) {
  const queryClient = useQueryClient();
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [customAvailability, setCustomAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const {
    data: scheduleCatalogResponse,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
    refetch: refetchCatalog,
  } = useQuery({
    queryKey: ["schedule-catalog", "expert-availability"],
    queryFn: () => getScheduleCatalog({ limit: 300 }),
    retry: false,
  });

  const {
    data: myAvailabilityResponse,
    isLoading: isMyAvailabilityLoading,
    refetch: refetchMyAvailability,
  } = useQuery({
    queryKey: ["expert-availability", "my"],
    queryFn: () => getMyExpertAvailability({ limit: 300 }),
    retry: false,
  });

  const rawCatalog = Array.isArray(scheduleCatalogResponse?.data)
    ? scheduleCatalogResponse.data
    : [];
  const myAvailability = Array.isArray(myAvailabilityResponse?.data)
    ? myAvailabilityResponse.data
    : [];
  const availabilityMessage =
    myAvailabilityResponse && myAvailabilityResponse.success === false
      ? myAvailabilityResponse.message
      : null;

  const upcomingCatalog = useMemo(
    () =>
      rawCatalog
        .filter(
          (slot) =>
            !slot.isDeleted &&
            Boolean(slot.startDateTime) &&
            isAfter(parseISO(slot.startDateTime), new Date()),
        )
        .sort(
          (left, right) =>
            new Date(left.startDateTime).getTime() - new Date(right.startDateTime).getTime(),
        ),
    [rawCatalog],
  );

  const publishedScheduleIds = useMemo(
    () => new Set(myAvailability.map((item) => item.scheduleId)),
    [myAvailability],
  );

  const catalogGroups = useMemo(
    () => groupByDate(upcomingCatalog, (slot) => slot.startDateTime),
    [upcomingCatalog],
  );

  const availabilityGroups = useMemo(
    () =>
      groupByDate(myAvailability, (slot) => slot.schedule?.startDateTime).map((group) => ({
        ...group,
        items: [...group.items].sort((left, right) => {
          const leftTime = new Date(left.schedule?.startDateTime || "").getTime();
          const rightTime = new Date(right.schedule?.startDateTime || "").getTime();
          return leftTime - rightTime;
        }),
      })),
    [myAvailability],
  );

  const publishMutation = useMutation({
    mutationFn: (payload: { scheduleIds: string[]; isPublished: boolean }) =>
      publishExpertAvailability(payload),
    onSuccess: async (result) => {
      setSelectedScheduleIds([]);
      await refetchMyAvailability();
      await queryClient.invalidateQueries({ queryKey: ["expert-availability"] });
      toast.success(
        `${result.count || 0} availability slot${result.count === 1 ? "" : "s"} ${result.isPublished ? "published" : "updated"} successfully.`,
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to publish expert availability right now.",
      );
    },
  });

  const createCustomSlotMutation = useMutation({
    mutationFn: async () => {
      if (
        !customAvailability.date ||
        !customAvailability.startTime ||
        !customAvailability.endTime
      ) {
        throw new Error("Please choose a date, start time, and end time first.");
      }

      const start = new Date(
        `${customAvailability.date}T${customAvailability.startTime}`,
      );
      const end = new Date(`${customAvailability.date}T${customAvailability.endTime}`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error("Please provide a valid availability time range.");
      }

      if (end <= start) {
        throw new Error("End time must be later than start time.");
      }

      const createdSlots = await createScheduleSlot({
        startDate: customAvailability.date,
        endDate: customAvailability.date,
        startTime: customAvailability.startTime,
        endTime: customAvailability.endTime,
      });

      await publishExpertAvailability({
        scheduleIds: createdSlots.map((slot) => slot.id),
        isPublished: true,
      });
      return createdSlots;
    },
    onSuccess: async (createdSlots) => {
      setCustomAvailability({ date: "", startTime: "", endTime: "" });
      await refetchMyAvailability();
      await queryClient.invalidateQueries({ queryKey: ["schedule-catalog"] });
      await queryClient.invalidateQueries({ queryKey: ["expert-availability"] });
      toast.success(
        `${createdSlots.length} availability slot${createdSlots.length === 1 ? "" : "s"} created and published successfully.`,
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create a new availability slot right now.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (scheduleId: string) => deleteExpertAvailability(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expert-availability"] });
      toast.success("Availability slot removed successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to remove this slot right now.",
      );
    },
  });

  const stats = {
    total: myAvailability.length,
    open: myAvailability.filter((item) => !item.isBooked).length,
    booked: myAvailability.filter((item) => item.isBooked).length,
  };

  const toggleSchedule = (scheduleId: string) => {
    setSelectedScheduleIds((current) =>
      current.includes(scheduleId)
        ? current.filter((id) => id !== scheduleId)
        : [...current, scheduleId],
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-violet-200/70 bg-linear-to-br from-violet-50 to-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Published slots</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/70 bg-linear-to-br from-emerald-50 to-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Open for booking</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats.open}</p>
          </CardContent>
        </Card>

        <Card className="border-sky-200/70 bg-linear-to-br from-sky-50 to-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Already booked</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats.booked}</p>
          </CardContent>
        </Card>
      </div>

      {mode === "manage" ? (
        <AvailabilityManagePanel
          catalogGroups={catalogGroups}
          availabilityGroups={availabilityGroups}
          selectedScheduleIds={selectedScheduleIds}
          publishedScheduleIds={publishedScheduleIds}
          customAvailability={customAvailability}
          availabilityMessage={availabilityMessage}
          isCatalogLoading={isCatalogLoading}
          isCatalogError={isCatalogError}
          isPublishing={publishMutation.isPending}
          isCreating={createCustomSlotMutation.isPending}
          isMyAvailabilityLoading={isMyAvailabilityLoading}
          isDeleting={deleteMutation.isPending}
          onCustomAvailabilityChange={(field, value) =>
            setCustomAvailability((current) => ({
              ...current,
              [field]: value,
            }))
          }
          onRefreshCatalog={() => {
            void refetchCatalog();
          }}
          onToggleSchedule={toggleSchedule}
          onClearSelection={() => setSelectedScheduleIds([])}
          onPublishSelected={() =>
            publishMutation.mutate({
              scheduleIds: selectedScheduleIds,
              isPublished: true,
            })
          }
          onCreateCustomSlot={() => createCustomSlotMutation.mutate()}
          onDeletePublished={(scheduleId) => deleteMutation.mutate(scheduleId)}
          onRefreshPublished={() => {
            void refetchMyAvailability();
          }}
          formatTimeRange={formatTimeRange}
        />
      ) : (
        <PublishedAvailabilityPanel
          groups={availabilityGroups}
          isLoading={isMyAvailabilityLoading}
          isDeleting={deleteMutation.isPending}
          availabilityMessage={availabilityMessage}
          showHeaderCta
          onDelete={(scheduleId) => deleteMutation.mutate(scheduleId)}
          onRefresh={() => {
            void refetchMyAvailability();
          }}
          formatTimeRange={formatTimeRange}
        />
      )}
    </div>
  );
}
