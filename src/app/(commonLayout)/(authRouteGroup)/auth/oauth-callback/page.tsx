import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/src/lib/authUtilis";
import { setTokenInCookies } from "@/src/lib/tokenUtils";

// OAuth tokens must never be cached. Always render fresh.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type OAuthCallbackSearchParams = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  sessionToken?: string;
  redirect?: string;
  callbackURL?: string;
  role?: string;
  emailVerified?: string;
  needPasswordChange?: string;
  email?: string;
  error?: string;
  message?: string;
};

const firstString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const isLocalRedirect = (value: string | undefined): value is string => {
  if (!value) return false;
  return value.startsWith("/") && !value.startsWith("//");
};

const renderError = (heading: string, body: string) => (
  <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-12 text-center">
    <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
    <p className="text-muted-foreground">{body}</p>
    <Link
      href="/login"
      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
    >
      Back to login
    </Link>
  </div>
);

export default async function OAuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) as OAuthCallbackSearchParams;

  // Surface backend-side OAuth errors instead of silently bouncing.
  const errorParam = firstString(params.error);
  const messageParam = firstString(params.message);
  if (errorParam) {
    return renderError(
      "Google sign-in failed",
      messageParam ||
        errorParam ||
        "We couldn't complete the sign-in. Please try again.",
    );
  }

  const accessToken = firstString(params.accessToken);
  const refreshToken = firstString(params.refreshToken);
  const sessionToken =
    firstString(params.token) ?? firstString(params.sessionToken);

  if (!accessToken && !refreshToken && !sessionToken) {
    return renderError(
      "Sign-in link expired",
      "We couldn't read your session details from the redirect. Please sign in again.",
    );
  }

  // Persist tokens on the frontend domain so subsequent requests carry them.
  // `setTokenInCookies` already purges duplicates before writing, so an OAuth
  // login coming in on top of a stale session won't leave orphan cookies.
  if (accessToken) {
    await setTokenInCookies("accessToken", accessToken, 7 * 24 * 60 * 60);
  }
  if (refreshToken) {
    await setTokenInCookies("refreshToken", refreshToken, 30 * 24 * 60 * 60);
  }
  if (sessionToken) {
    await setTokenInCookies(
      "better-auth.session_token",
      sessionToken,
      24 * 60 * 60,
    );
  }

  // Decide where to send the user next.
  const role = (firstString(params.role) || "").toUpperCase() as UserRole;
  const emailVerified = firstString(params.emailVerified);
  const needPasswordChange = firstString(params.needPasswordChange);
  const email = firstString(params.email);

  if (emailVerified === "false") {
    redirect(
      email
        ? `/verify-email?email=${encodeURIComponent(email)}`
        : "/verify-email",
    );
  }

  if (needPasswordChange === "true") {
    redirect(
      email
        ? `/change-password?email=${encodeURIComponent(email)}`
        : "/change-password",
    );
  }

  const requestedRedirect =
    firstString(params.redirect) ?? firstString(params.callbackURL);

  let target: string;
  if (
    isLocalRedirect(requestedRedirect) &&
    (!role || isValidRedirectForRole(requestedRedirect, role))
  ) {
    target = requestedRedirect;
  } else if (role === "ADMIN" || role === "EXPERT" || role === "CLIENT") {
    target = getDefaultDashboardRoute(role);
  } else {
    // Unknown role: send to the generic client dashboard. The middleware will
    // re-route based on the actual role read from the access token.
    target = "/dashboard";
  }

  redirect(target);
}
