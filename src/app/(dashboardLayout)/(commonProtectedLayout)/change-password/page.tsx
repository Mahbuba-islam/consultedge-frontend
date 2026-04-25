import { KeyRound, ShieldCheck, Sparkles } from "lucide-react";

import ForgetPasswordForm from "@/components/modules/auth/ForgetPasswordForm";
import { getUserInfo } from "@/src/services/auth.services";

type ChangePasswordParams = {
  email?: string;
};

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<ChangePasswordParams>;
}) {
  const params = await searchParams;
  const user = await getUserInfo();
  const email = params.email || user?.email;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.14),transparent_50%)]"
      />

      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        {/* Glass card */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          {/* gradient accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-cyan-500 to-teal-400" />
          {/* dark glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-cyan-500/15 blur-3xl" />

          <div className="relative space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                <KeyRound className="size-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-200">
                <Sparkles className="size-3.5" />
                Secure account update
              </span>
            </div>

            <ForgetPasswordForm
              initialEmail={email ?? ""}
              lockEmail={Boolean(email)}
              title="Change Password"
              description="We will send a reset OTP to your email so you can set a new password securely."
              submitLabel="Send OTP"
              pendingLabel="Sending OTP..."
              showLoginLink={false}
            />

            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              <p>
                Your account is protected by encrypted OTP verification. Never share your OTP with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}