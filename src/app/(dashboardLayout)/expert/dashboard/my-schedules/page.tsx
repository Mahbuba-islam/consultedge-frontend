import AvailabilityActionsDropdown from "@/components/modules/Experts/AvailabilityActionsDropdown";
import ExpertAvailabilityForm from "@/components/modules/Experts/ExpertAvailabilityForm";

export default function MySchedulesPage() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <section className="overflow-hidden rounded-3xl border-0 bg-linear-to-r from-slate-900 via-violet-900 to-fuchsia-800 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/80">Expert Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight">My schedules</h1>
            <p className="mt-2 max-w-2xl text-white/80">
              Review your published availability, keep open slots fresh, and manage upcoming consultation windows with confidence.
            </p>
          </div>

          <AvailabilityActionsDropdown />
        </div>
      </section>

      <ExpertAvailabilityForm mode="overview" />
    </div>
  );
}
