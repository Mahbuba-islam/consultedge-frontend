/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "../lib/axious/httpClient";
import { IAdminDashboardStats } from "../types/admin.dashboard";



export async function getDashboardData() {
    try {
        const response = await httpClient.get<IAdminDashboardStats>("/stats")
          console.log(response);
        return response;
    } catch (error : any) {
      console.log(error, "From Dashboard Server Action");
      return {
        success: false,
        message: error.message || "An error occurred while fetching dashboard data.",
        data: null,
        meta: null,
      }  
    }
}