"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/src/lib/authUtilis";

import { setTokenInCookies } from "@/src/lib/tokenUtils";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILOginResponse, IRegisterResponse } from "@/src/types/auth.types";

import { redirect } from "next/navigation";
import { httpClient } from "@/src/lib/axious/httpClient";
import { IRegisterPayload, registerZodSchema } from "@/src/zod/auth.validation";

/**
 * 📝 registerAction()
 * -------------------------------------------------
 * Handles:
 * - Zod validation
 * - API request to backend
 * - Token storage
 * - Redirect logic (verify email, role-based)
 */

export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string
): Promise<IRegisterResponse | ApiErrorResponse> => {
  // 1️⃣ Validate input
  const parsed = registerZodSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    // 2️⃣ Call backend API
    const response = await httpClient.post<ILOginResponse>(
      "/auth/register",
      parsed.data
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified, needPasswordChange, email } = user;

    // 3️⃣ Save tokens
    await setTokenInCookies("accessToken", accessToken, 7 * 24 * 60 * 60);
    await setTokenInCookies("refreshToken", refreshToken, 30 * 24 * 60 * 60);
   
    // 4️⃣ Redirect logic
    if (!emailVerified) {
      redirect(`/verify-email?email=${email}`);
    }

    if (needPasswordChange) {
      redirect(`/reset-password?email=${email}`);
    }

    const targetPath =
      redirectPath &&
      isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    redirect(targetPath);
  } catch (error: any) {
    console.log(error, "register error");

    // Allow Next.js redirect errors to bubble
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    // Backend says email not verified
    if (
      error?.response?.data?.message === "Email not verified" &&
      payload.email
    ) {
      redirect(`/verify-email?email=${payload.email}`);
    }

    return {
      success: false,
      message: error?.response?.data?.message || "Registration failed",
    };
  }
};