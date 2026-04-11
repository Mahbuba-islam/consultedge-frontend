import { httpClient } from "../lib/axious/httpClient";
import type { ITestimonial } from "../types/testimonial.types";

const normalizeTestimonials = (payload: ITestimonial[] | undefined) =>
  Array.isArray(payload) ? payload : [];

const requestTestimonials = async (
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<ITestimonial[]> => {
  const response = await httpClient.get<ITestimonial[]>(endpoint, {
    params,
    silent: true,
  });

  return normalizeTestimonials(response.data);
};

export const getAllTestimonials = async (
  limit = 6,
): Promise<ITestimonial[]> => {
  const params = {
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  try {
    return await requestTestimonials("/testimonial", params);
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

export const getTestimonialsByExpert = async (
  expertId: string,
): Promise<ITestimonial[]> => {
  if (!expertId) {
    return [];
  }

  try {
    return await requestTestimonials(`/testimonial/expert/${expertId}`);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      try {
        return await requestTestimonials(`/testimonials/expert/${expertId}`);
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

export const deleteTestimonialAction = async (testimonialId: string) => {
  if (!testimonialId) {
    throw new Error("A valid review ID is required.");
  }

  try {
    const response = await httpClient.delete<{ success?: boolean }>(
      `/testimonial/${testimonialId}`,
      { silent: true },
    );

    return response.data ?? { success: response.success };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      try {
        const fallbackResponse = await httpClient.delete<{ success?: boolean }>(
          `/testimonials/${testimonialId}`,
          { silent: true },
        );

        return fallbackResponse.data ?? { success: fallbackResponse.success };
      } catch (fallbackError: any) {
        if ([404, 405].includes(fallbackError?.response?.status)) {
          throw new Error("Review deletion is not available from the server yet.");
        }

        throw fallbackError;
      }
    }

    if (error?.response?.status === 405) {
      throw new Error("Review deletion is not available from the server yet.");
    }

    throw error;
  }
};
