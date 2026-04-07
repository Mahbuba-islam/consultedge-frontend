import { PieChartData } from "./dashboard.types";

export interface IExpertDashboardStats {
  consultationCount: number;
  clientCount: number;
  totalRevenue: number;

  consultationStatusDistribution: PieChartData[];

  reviewCount: number;
}
