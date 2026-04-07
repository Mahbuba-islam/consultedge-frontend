"use client";

import Link from "next/link";
import DateCell from "../../shared/Cell/DataCell";
import { IIndustry } from "@/src/types/industry.types";

export default function IndustryList({ industries }: { industries: IIndustry[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Icon</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-left">Updated</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {industries.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No industries found
              </td>
            </tr>
          )}

          {industries.map((industry) => (
            <tr key={industry.id} className="border-t">
              {/* Icon */}
              <td className="p-3">
                {industry.icon ? (
                  <img
                    src={industry.icon}
                    alt={industry.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">No Icon</span>
                )}
              </td>

              {/* Name */}
              <td className="p-3 font-medium">{industry.name}</td>

              {/* Description */}
              <td className="p-3 text-gray-600">
                {industry.description || "—"}
              </td>

              {/* Created */}
              <td className="p-3">
                <DateCell date={industry.createdAt} />
              </td>

              {/* Updated */}
              <td className="p-3">
                <DateCell date={industry.updatedAt} />
              </td>

              {/* Actions */}
              <td className="p-3 space-x-3">
                <Link
                  href={`/admin/industries-management/${industry.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>

                <button
                  className="text-red-600 hover:underline"
                  onClick={() => console.log("Delete", industry.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
