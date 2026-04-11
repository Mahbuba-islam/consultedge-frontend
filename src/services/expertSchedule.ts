import { buildFormUrlEncodedPayload } from "../lib/axious/buildFormUrlEncodedPayload";
import { httpClient } from "../lib/axious/httpClient";
import type {
  IAssignExpertAvailabilityPayload,
  IExpertAvailability,
  IExpertAvailabilityQueryParams,
  IPublishExpertAvailabilityPayload,
  IPublishExpertAvailabilityResponse,
  IUpdateExpertAvailabilityPayload,
} from "../types/expert.types";

export const assignExpertSchedules = async (
  payload: IAssignExpertAvailabilityPayload,
): Promise<IExpertAvailability[]> => {
  const response = await httpClient.post<IExpertAvailability[]>(
    "/expert-schedules/assign",
    buildFormUrlEncodedPayload(payload),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return Array.isArray(response.data) ? response.data : [];
};

export const publishExpertAvailability = async (
  payload: IPublishExpertAvailabilityPayload,
): Promise<IPublishExpertAvailabilityResponse> => {
  const response = await httpClient.patch<IPublishExpertAvailabilityResponse>(
    "/expert-schedules/my/publish",
    buildFormUrlEncodedPayload(payload),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return {
    count: Number(response.data?.count ?? response.data?.schedules?.length ?? 0),
    isPublished: Boolean(response.data?.isPublished ?? payload.isPublished),
    schedules: Array.isArray(response.data?.schedules) ? response.data.schedules : [],
  };
};

export const getMyExpertSchedules = async (params?: IExpertAvailabilityQueryParams) => {
  return httpClient.get<IExpertAvailability[]>("/expert-schedules/my", {
    params,
  });
};

export const getAllExpertSchedules = async (
  params?: IExpertAvailabilityQueryParams,
) => {
  return httpClient.get<IExpertAvailability[]>("/expert-schedules", {
    params,
  });
};

export const getExpertScheduleById = async (
  expertId: string,
  scheduleId: string,
): Promise<IExpertAvailability> => {
  const response = await httpClient.get<IExpertAvailability>(
    `/expert-schedules/${expertId}/${scheduleId}`,
  );

  return response.data;
};

export const updateMyExpertSchedules = async (
  payload: IUpdateExpertAvailabilityPayload,
): Promise<{ success: boolean }> => {
  const response = await httpClient.put<{ success: boolean }>(
    "/expert-schedules/my",
    buildFormUrlEncodedPayload(payload),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

export const deleteMyExpertSchedule = async (
  scheduleId: string,
): Promise<{ success: boolean }> => {
  const response = await httpClient.delete<{ success: boolean }>(
    `/expert-schedules/my/${scheduleId}`,
  );

  return response.data;
};
