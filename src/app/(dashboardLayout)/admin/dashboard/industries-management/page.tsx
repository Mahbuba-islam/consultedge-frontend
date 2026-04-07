
import type { ComponentType } from "react";
import IndustryList from "@/components/modules/dashboard/Industry/IndustryList";
import { getAllIndustriesAction } from "@/src/services/industry.services";
import Link from "next/link";



export default async function IndustryListPage() {
  const response = await getAllIndustriesAction();
  const industries = response?.data || [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Industry Management</h1>

        <Link
          href="/admin/dashboard/industries-management/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Industry
        </Link>
      </div>

      <IndustryList industries={industries} />
    </div>
  );
}
