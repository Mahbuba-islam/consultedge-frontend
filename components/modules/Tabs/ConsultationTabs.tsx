"use client";

import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, AlertTriangle, type LucideIcon } from "lucide-react";

interface TabItem {
  key: "upcoming" | "completed" | "missed";
  label: string;
  count: number;
  icon: LucideIcon;
  activeGradient: string;
  activeShadow: string;
  badgeActiveBg: string;
  countTone: string;
}

interface Props {
  activeTab: string;
  setActiveTab: (tab: "upcoming" | "completed" | "missed") => void;
  upcomingCount: number;
  completedCount: number;
  missedCount: number;
}

export default function ConsultationTabs({
  activeTab,
  setActiveTab,
  upcomingCount,
  completedCount,
  missedCount,
}: Props) {
  const tabs: TabItem[] = [
    {
      key: "upcoming",
      label: "Upcoming",
      count: upcomingCount,
      icon: CalendarClock,
      activeGradient: "from-blue-600 to-cyan-500",
      activeShadow: "shadow-cyan-500/25",
      badgeActiveBg: "bg-white/25",
      countTone: "text-blue-700 bg-blue-100/70 dark:text-blue-200 dark:bg-blue-500/15",
    },
    {
      key: "completed",
      label: "Completed",
      count: completedCount,
      icon: CheckCircle2,
      activeGradient: "from-emerald-600 to-teal-500",
      activeShadow: "shadow-emerald-500/25",
      badgeActiveBg: "bg-white/25",
      countTone: "text-emerald-700 bg-emerald-100/70 dark:text-emerald-200 dark:bg-emerald-500/15",
    },
    {
      key: "missed",
      label: "Missed",
      count: missedCount,
      icon: AlertTriangle,
      activeGradient: "from-rose-600 to-orange-500",
      activeShadow: "shadow-rose-500/25",
      badgeActiveBg: "bg-white/25",
      countTone: "text-rose-700 bg-rose-100/70 dark:text-rose-200 dark:bg-rose-500/15",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-1.5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
      <div
        role="tablist"
        aria-label="Consultation status filters"
        className="flex flex-wrap gap-1.5 sm:flex-nowrap"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-1 min-w-27.5 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all sm:px-4 ${
                isActive
                  ? `bg-linear-to-r ${tab.activeGradient} text-white shadow-md ${tab.activeShadow}`
                  : "text-slate-700 hover:bg-white/70 hover:text-foreground dark:text-slate-200 dark:hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="consultation-tab-pill"
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 -z-10 rounded-xl bg-linear-to-r ${tab.activeGradient}`}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <Icon className="size-4 shrink-0" />
              <span className="truncate">{tab.label}</span>

              <span
                className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                  isActive ? `${tab.badgeActiveBg} text-white` : tab.countTone
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
