import Link from "next/link";
import { Layers, PlusCircle, Sparkles } from "lucide-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import IndustryList from "@/components/modules/dashboard/Industry/IndustryList";
import { getAllIndustries } from "@/src/services/industry.services";

export default async function IndustryListPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["industries"],
    queryFn: getAllIndustries,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="space-y-6 p-4 md:p-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-cyan-500 to-teal-400" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.18),transparent_55%)] dark:block"
          />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-200">
                <Sparkles className="size-3.5" />
                Platform catalog
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Manage industries</h1>
              <p className="text-sm text-muted-foreground">
                Curate the industries clients can browse and book experts under.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25">
                <Layers className="size-6" />
              </div>
              <Link
                href="/admin/dashboard/industries-management/create"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition hover:from-blue-700 hover:to-cyan-600"
              >
                <PlusCircle className="size-4" />
                Add industry
              </Link>
            </div>
          </div>
        </div>

        <IndustryList />
      </section>
    </HydrationBoundary>
  );
}
