import { NextRequest, NextResponse } from "next/server";
import jwt, { type JwtPayload } from "jsonwebtoken";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  type UserRole,
} from "@/src/lib/authUtilis";

// OAuth tokens must never be cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const isLocalRedirect = (value: string | null | undefined): value is string =>
  Boolean(value && value.startsWith("/") && !value.startsWith("//"));

const getTokenSecondsRemaining = (token: string): number => {
  if (!token) return 0;
  try {
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload?.exp) return 0;
    const remaining = payload.exp - Math.floor(Date.now() / 1000);
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
};

const ORPHAN_PURGE_PATHS = ["/", "/api", "/api/v1", "/auth", "/dashboard"];

// Issue expired Set-Cookie headers across every plausible (path, secure,
// httpOnly) combo so any orphan duplicates from prior writes get evicted in
// the same response that ships the new tokens.
const purgeCookieEverywhere = (response: NextResponse, name: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const httpOnlyVariants = [true, false];
  const secureVariants = isProduction ? [true, false] : [false];

  for (const path of ORPHAN_PURGE_PATHS) {
    for (const httpOnly of httpOnlyVariants) {
      for (const secure of secureVariants) {
        try {
          response.cookies.set({
            name,
            value: "",
            path,
            httpOnly,
            secure,
            sameSite: "lax",
            maxAge: 0,
            expires: new Date(0),
          });
        } catch {
          /* ignore individual variant failures */
        }
      }
    }
  }
};

const setAuthCookie = (
  response: NextResponse,
  name: string,
  value: string,
  fallbackMaxAge: number,
) => {
  const isProduction = process.env.NODE_ENV === "production";
  // The access token must be browser-readable so the client-side axios layer
  // can attach `Authorization: Bearer …` to cross-origin backend calls.
  const isBrowserReadable = name === "accessToken";

  let maxAge = fallbackMaxAge;
  if (name !== "better-auth.session_token") {
    const fromToken = getTokenSecondsRemaining(value);
    if (fromToken > 0) maxAge = fromToken;
  }

  response.cookies.set({
    name,
    value,
    path: "/",
    httpOnly: !isBrowserReadable,
    secure: isProduction,
    sameSite: "lax",
    maxAge,
  });
};

const buildErrorRedirect = (origin: string, message: string) => {
  const url = new URL("/login", origin);
  url.searchParams.set("oauthError", message);
  return NextResponse.redirect(url);
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");
  if (errorParam) {
    return buildErrorRedirect(
      origin,
      messageParam || errorParam || "Google sign-in failed.",
    );
  }

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const sessionToken =
    searchParams.get("token") ?? searchParams.get("sessionToken");

  if (!accessToken && !refreshToken && !sessionToken) {
    return buildErrorRedirect(
      origin,
      "Sign-in link was missing tokens. Please try again.",
    );
  }

  // Decide where to send the user next.
  const role = (searchParams.get("role") || "").toUpperCase() as UserRole | "";
  const emailVerified = searchParams.get("emailVerified");
  const needPasswordChange = searchParams.get("needPasswordChange");
  const email = searchParams.get("email");
  const requestedRedirect =
    searchParams.get("redirect") ?? searchParams.get("callbackURL");

  let target: string;
  if (emailVerified === "false") {
    target = email
      ? `/verify-email?email=${encodeURIComponent(email)}`
      : "/verify-email";
  } else if (needPasswordChange === "true") {
    target = email
      ? `/change-password?email=${encodeURIComponent(email)}`
      : "/change-password";
  } else if (
    isLocalRedirect(requestedRedirect) &&
    (!role || isValidRedirectForRole(requestedRedirect, role as UserRole))
  ) {
    target = requestedRedirect;
  } else if (role === "ADMIN" || role === "EXPERT" || role === "CLIENT") {
    target = getDefaultDashboardRoute(role as UserRole);
  } else {
    // Unknown role — let the middleware re-route based on the access token.
    target = "/dashboard";
  }

  const response = NextResponse.redirect(new URL(target, origin));

  // Sweep orphan duplicates first, then write the fresh tokens.
  for (const name of [
    "accessToken",
    "refreshToken",
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
  ]) {
    purgeCookieEverywhere(response, name);
  }

  if (accessToken) {
    setAuthCookie(response, "accessToken", accessToken, 7 * 24 * 60 * 60);
  }
  if (refreshToken) {
    setAuthCookie(response, "refreshToken", refreshToken, 30 * 24 * 60 * 60);
  }
  if (sessionToken) {
    setAuthCookie(
      response,
      "better-auth.session_token",
      sessionToken,
      24 * 60 * 60,
    );
  }

  return response;
}
