import { PieChartData } from "./dashboard.types";

export interface IClientDashboardStats {
  consultationCount: number;
  consultationStatusDistribution: PieChartData[];
}