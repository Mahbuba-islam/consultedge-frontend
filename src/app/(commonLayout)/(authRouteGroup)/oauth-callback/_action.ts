"use server";

import { redirect } from "next/navigation";

import { setTokenInCookies } from "@/src/lib/tokenUtils";

type StoreOAuthTokensInput = {
  accessToken?: string | null;
  refreshToken?: string | null;
  redirectTo?: string | null;
};

const safeRedirect = (target: string | null | undefined) => {
  if (!target) return "/dashboard";
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  return "/dashboard";
};

export async function storeOAuthTokensAction({
  accessToken,
  refreshToken,
  redirectTo,
}: StoreOAuthTokensInput) {
  if (!accessToken && !refreshToken) {
    redirect("/login?error=oauth_missing_tokens");
  }

  if (accessToken) {
    await setTokenInCookies("accessToken", accessToken);
  }

  if (refreshToken) {
    await setTokenInCookies("refreshToken", refreshToken, 60 * 60 * 24 * 30);
  }

  redirect(safeRedirect(redirectTo));
}
