"use client";


import { getDashboardData } from "@/src/services/dashboard.services";
import { ApiResponse } from "@/src/types/api.types";

import { useQuery } from "@tanstack/react-query";
import StatsCard from "../shared/StatsCard";
import ConsultationsPieChart from "../shared/ConsultationsPieCharts";
import { IAdminDashboardStats } from "@/src/types/admin.dashboard";
import ConsultationsBarChart from "../shared/ConsultationsBarChart";

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const { data } = adminDashboardData as ApiResponse<IAdminDashboardStats>;

  return (
    <div className="grid gap-6">
      {/* ====== TOP STATS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Experts"
          value={data?.expertCount || 0}
          iconName="UserCog"
          description="Registered experts on the platform"
        />

        <StatsCard
          title="Total Clients"
          value={data?.clientCount || 0}
          iconName="Users"
          description="Registered clients on the platform"
        />

        <StatsCard
          title="Total Consultations"
          value={data?.consultationCount || 0}
          iconName="CalendarDays"
          description="All consultations booked"
        />

        <StatsCard
          title="Total Revenue"
          value={`$${data?.totalRevenue || 0}`}
          iconName="DollarSign"
          description="Total paid revenue"
        />

        <StatsCard
          title="Total Industries"
          value={data?.industryCount || 0}
          iconName="Layers"
          description="Industries available"
        />

        <StatsCard
          title="Total Users"
          value={data?.userCount || 0}
          iconName="User"
          description="All users in the system"
        />
      </div>

      {/* ====== CHARTS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsultationsBarChart data={data?.revenueByMonth || []} />

        <ConsultationsPieChart
          data={data?.consultationStatusDistribution || []}
        />
      </div>
    </div>
  );
};

export default AdminDashboardContent;