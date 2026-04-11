"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { ITestimonial } from "@/src/types/testimonial.types";

export type ReviewOverride = {
  isHidden?: boolean;
  expertReply?: string;
  repliedAt?: string;
};

type ReviewOverrideMap = Record<string, ReviewOverride>;

const STORAGE_KEY = "consultedge:review-overrides:v1";

const readStoredOverrides = (): ReviewOverrideMap => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ReviewOverrideMap) : {};
  } catch {
    return {};
  }
};

const persistOverrides = (overrides: ReviewOverrideMap) => {
  if (typeof window === "undefined") {
    return;
  }

  if (Object.keys(overrides).length === 0) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

export const applyReviewOverrides = (
  reviews: ITestimonial[],
  overrides: ReviewOverrideMap,
): ITestimonial[] => {
  return reviews.map((review) => {
    const override = overrides[review.id];

    return {
      ...review,
      isHidden: override?.isHidden ?? review.isHidden ?? false,
      expertReply: override?.expertReply ?? review.expertReply ?? null,
      repliedAt: override?.repliedAt ?? review.repliedAt,
    };
  });
};

export const useReviewOverrides = (reviews: ITestimonial[] = []) => {
  const [overrides, setOverrides] = useState<ReviewOverrideMap>({});

  useEffect(() => {
    setOverrides(readStoredOverrides());
  }, []);

  const updateOverride = useCallback((reviewId: string, partial: ReviewOverride) => {
    setOverrides((previous) => {
      const next = { ...previous };
      const merged: ReviewOverride = {
        ...next[reviewId],
        ...partial,
      };

      const normalizedReply = merged.expertReply?.trim();

      if (normalizedReply) {
        merged.expertReply = normalizedReply;
      } else {
        delete merged.expertReply;
      }

      if (!merged.repliedAt) {
        delete merged.repliedAt;
      }

      if (typeof merged.isHidden !== "boolean") {
        delete merged.isHidden;
      }

      if (Object.keys(merged).length === 0) {
        delete next[reviewId];
      } else {
        next[reviewId] = merged;
      }

      persistOverrides(next);
      return next;
    });
  }, []);

  const setReviewHidden = useCallback(
    (reviewId: string, isHidden: boolean) => {
      updateOverride(reviewId, { isHidden });
    },
    [updateOverride],
  );

  const saveExpertReply = useCallback(
    (reviewId: string, expertReply: string) => {
      const normalizedReply = expertReply.trim();

      updateOverride(reviewId, {
        expertReply: normalizedReply,
        repliedAt: normalizedReply ? new Date().toISOString() : undefined,
      });
    },
    [updateOverride],
  );

  const clearExpertReply = useCallback(
    (reviewId: string) => {
      updateOverride(reviewId, {
        expertReply: undefined,
        repliedAt: undefined,
      });
    },
    [updateOverride],
  );

  const mergedReviews = useMemo(
    () => applyReviewOverrides(reviews, overrides),
    [overrides, reviews],
  );

  return {
    mergedReviews,
    overrides,
    setReviewHidden,
    saveExpertReply,
    clearExpertReply,
  };
};
