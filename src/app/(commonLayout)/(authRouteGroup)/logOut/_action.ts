"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { purgeCookieEverywhere } from "@/src/lib/cookieUtils";

const normalizeApiBaseUrl = (rawValue?: string) => {
  const value = rawValue?.trim().replace(/\/+$/, "");
  if (!value) return undefined;
  return value.endsWith("/api/v1") ? value : `${value}/api/v1`;
};

const BASE_API_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

const TOKEN_COOKIE_NAMES = [
  "accessToken",
  "refreshToken",
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session_data",
];

export const logoutAction = async () => {
  const cookieStore = await cookies();

  // 🛰️ Best-effort backend logout so the server-side BetterAuth session is
  // invalidated too. We swallow any failure — local cookie cleanup must still
  // happen even if the backend is unreachable.
  if (BASE_API_URL) {
    try {
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      await fetch(`${BASE_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        cache: "no-store",
      });
    } catch {
      /* ignore */
    }
  }

  // 🧹 Aggressively expire every known auth cookie across all path / secure /
  // httpOnly variants. This evicts orphan duplicates that were written by
  // older deploys (or by the middleware on a non-root path) which a plain
  // `cookieStore.delete(name)` would silently leave behind.
  for (const name of TOKEN_COOKIE_NAMES) {
    await purgeCookieEverywhere(name);
    cookieStore.delete(name);
  }

  redirect("/login");
};
