"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { storeOAuthTokensAction } from "./_action";

// This page is the OAuth landing target after the backend completes the
// Google OAuth dance. The backend cannot set cookies on this domain (different
// registrable domain), so it instead redirects here with the tokens carried in
// the URL — either as query parameters (?accessToken=...&refreshToken=...)
// or as a hash fragment (#accessToken=...&refreshToken=...). We read them on
// the client, hand them off to a server action that writes them as cookies on
// THIS domain, and then continue to the user's intended destination.
export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const fromQuery = (key: string) => searchParams.get(key);

    const fromHash = (key: string) => {
      if (typeof window === "undefined") return null;
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return null;
      const params = new URLSearchParams(hash);
      return params.get(key);
    };

    const pickToken = (...keys: string[]) => {
      for (const key of keys) {
        const value = fromQuery(key) || fromHash(key);
        if (value) return value;
      }
      return null;
    };

    const accessToken = pickToken("accessToken", "access_token", "token");
    const refreshToken = pickToken("refreshToken", "refresh_token");
    const redirectTo =
      fromQuery("redirect") ||
      fromQuery("redirectTo") ||
      fromQuery("callbackURL") ||
      "/dashboard";

    const errorParam = fromQuery("error");
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
      const t = setTimeout(() => router.replace("/login"), 2000);
      return () => clearTimeout(t);
    }

    if (!accessToken && !refreshToken) {
      setErrorMessage(
        "We couldn't read your sign-in details from the redirect. Please try again.",
      );
      const t = setTimeout(() => router.replace("/login"), 2500);
      return () => clearTimeout(t);
    }

    void storeOAuthTokensAction({
      accessToken,
      refreshToken,
      redirectTo,
    });
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">
          {errorMessage ? "Sign-in failed" : "Finishing sign-in..."}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {errorMessage ?? "Hang tight while we get you to your dashboard."}
        </p>
      </div>
    </div>
  );
}
