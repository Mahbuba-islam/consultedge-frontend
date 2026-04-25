"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, Clock, RefreshCw, Sparkles, Wallet } from "lucide-react";

type ConsultationHeaderProps = {
  isFetching: boolean;
  refetch: () => void;
  stats: {
    total: number;
    active: number;
    unpaid: number;
  };
};

export default function ConsultationHeader({
  isFetching,
  refetch,
  stats,
}: ConsultationHeaderProps) {
  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-blue-900 to-cyan-800 p-8 text-white shadow-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.25),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.25),transparent_55%)]"
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge className="border-white/20 bg-white/10 text-white backdrop-blur">
              <Sparkles className="mr-1 size-3.5" />
              Client Dashboard
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              My Consultations
            </h1>
            <p className="text-white/80">
              Track upcoming sessions, payment status, and expert details from one place.
            </p>
          </div>

          <Button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="rounded-full border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <RefreshCw className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </section>

      {/* STATS GRID */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-blue-200/60 bg-linear-to-br from-blue-50 to-white shadow-sm dark:border-blue-500/20 dark:from-blue-500/10 dark:to-slate-900/80">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 to-cyan-500" />
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total consultations
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              <CalendarClock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-emerald-200/60 bg-linear-to-br from-emerald-50 to-white shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-slate-900/80">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500" />
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active sessions
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.active}</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-amber-200/60 bg-linear-to-br from-amber-50 to-white shadow-sm dark:border-amber-500/20 dark:from-amber-500/10 dark:to-slate-900/80">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-500 to-orange-500" />
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Awaiting payment
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.unpaid}</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <Wallet className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
