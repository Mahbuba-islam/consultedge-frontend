import { ApiResponse } from "./api.types";

export interface IIndustry {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}


export type IIndustryListResponse = ApiResponse<IIndustry[]>;