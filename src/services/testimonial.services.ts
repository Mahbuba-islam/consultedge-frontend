import { httpClient } from "../lib/axious/httpClient";
import { ApiResponse } from "../types/api.types";

import type { ITestimonial } from "../types/testimonial.types";

// ------------------------------
// HELPERS
// ------------------------------
const normalizeTestimonials = (payload: ITestimonial[] | undefined) =>
  Array.isArray(payload) ? payload : [];

// Extract actual data from backend response
const extractData = (response: any) => response?.data?.data;

// ------------------------------
// GENERIC REQUEST HANDLER
// ------------------------------
const requestTestimonials = async (
  endpoint: string,
  params?: Record<string, unknown>
): Promise<ITestimonial[]> => {
  const response = await httpClient.get(endpoint, {
    params,
    silent: true,
  });

  return normalizeTestimonials(extractData(response));
};

// ------------------------------
// CREATE TESTIMONIAL ✅ (FIXED)
// ------------------------------
export const createTestimonial = async (payload: {
  rating: number;
  comment: string;
  consultationId: string;
}): Promise<ITestimonial> => {
  const response = await httpClient.post("/testimonials", payload);

  return extractData(response);
};

// ------------------------------
// GET ALL TESTIMONIALS
// ------------------------------
export const getAllTestimonials = async (
  limit = 6
): Promise<ITestimonial[]> => {
  const params = {
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  try {
    return await requestTestimonials("/testimonials", params);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      try {
        return await requestTestimonials("/testimonials", params);
      } catch (fallbackError: any) {
        if (fallbackError?.response?.status === 404) {
          return [];
        }
        throw fallbackError;
      }
    }
    throw error;
  }
};

// ------------------------------
// GET TESTIMONIALS BY EXPERT
// ------------------------------
// export const getTestimonialsByExpert = async (
//   expertId: string
// ): Promise<ITestimonial[]> => {
//   if (!expertId) return [];

//   try {
//     return await requestTestimonials(`/testimonials/expert/${expertId}`);
//   } catch (error: any) {
//     const status = error?.response?.status;

//     // ✅ treat "not found" as empty list (normal case)
//     if (status === 404) {
//       return [];
//     }

//     // ❌ everything else is a real error
//     throw error;
//   }
// };


export const getTestimonialsByExpert = async (
  expertId: string
): Promise<ITestimonial[]> => {
  const res = await httpClient.get<any>(
    `/testimonials/expert/${expertId}`
  );

  console.log("FINAL RES:", res);

  // 🔥 handle all cases safely
  const data =
    res?.data?.data ??
    res?.data ??
    res;

  return Array.isArray(data) ? data : [];
};



// ------------------------------
// REPLY TO TESTIMONIAL
export const replyToTestimonial = async (
  testimonialId: string,
  payload: { expertReply: string }
): Promise<ApiResponse<ITestimonial>> => {
  if (!testimonialId) {
    throw new Error("Testimonial ID is required.");
  }

  const response = await httpClient.patch<ApiResponse<ITestimonial>>(
    `/testimonials/${testimonialId}/reply`,
    payload
  );

  return response.data;
};










// ------------------------------
// DELETE TESTIMONIAL
// ------------------------------
export const deleteTestimonialAction = async (
  testimonialId: string
) => {
  if (!testimonialId) {
    throw new Error("A valid review ID is required.");
  }

  try {
    const response = await httpClient.delete(`/testimonials/${testimonialId}`, {
      silent: true,
    });

    return response?.data ?? { success: true };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      try {
        const fallbackResponse = await httpClient.delete(
          `/testimonials/${testimonialId}`,
          { silent: true }
        );

        return fallbackResponse?.data ?? { success: true };
      } catch (fallbackError: any) {
        if ([404, 405].includes(fallbackError?.response?.status)) {
          throw new Error(
            "Review deletion is not available from the server yet."
          );
        }
        throw fallbackError;
      }
    }

    if (error?.response?.status === 405) {
      throw new Error(
        "Review deletion is not available from the server yet."
      );
    }

    throw error;
  }
};