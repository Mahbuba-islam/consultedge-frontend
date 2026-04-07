import { BarChartData, PieChartData } from "./dashboard.types";

export interface IAdminDashboardStats {
  expertCount: number;
  clientCount: number;
  consultationCount: number;
  industryCount: number;
  paymentCount: number;
  userCount: number;

  totalRevenue: number;

  consultationStatusDistribution: PieChartData[];

  revenueByMonth: BarChartData[];
}