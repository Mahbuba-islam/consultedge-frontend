import { KeyRound, Sparkles } from "lucide-react";

import ForgetPasswordForm from "@/components/modules/auth/ForgetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(34,211,238,0.18),transparent_45%)]"
      />
      <div className="mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-cyan-500 to-teal-400" />
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                <KeyRound className="size-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-200">
                <Sparkles className="size-3.5" />
                Password recovery
              </span>
            </div>
            <ForgetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
