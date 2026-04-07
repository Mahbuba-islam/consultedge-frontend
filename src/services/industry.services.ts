"use server";
import { httpClient } from "@/src/lib/axious/httpClient";
import { revalidatePath } from "next/cache";
import { IIndustryListResponse } from "../types/industry.types";


export async function createIndustryAction(formData: FormData) {
  try {
    const response = await httpClient.post("/industries", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
    });
    if (response.success) {
      revalidatePath("/dashboard/industries");
    }
}

  

  catch(error : any){
    return {
    success: false,
    message:
      error?.response?.data?.message ||
      error.message ||
      "Failed to create industry.",
    data: null,
  };
  }
}




export async function getAllIndustriesAction() {
  try {
    const response = await httpClient.get<IIndustryListResponse>("/industries");
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch industries",
      data: [],
    };
  }
}