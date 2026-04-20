// "use client";

// import { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { deleteIndustry, getAllIndustries } from "@/src/services/industry.services";
// import Link from "next/link";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import DateCell from "../../shared/Cell/DataCell";

// export default function IndustryList() {
//   const queryClient = useQueryClient();
//   const [selectedIndustry, setSelectedIndustry] = useState<{
//     id: string;
//     name?: string;
//   } | null>(null);

//   const { data: industriesResponse } = useQuery({
//     queryKey: ["industries"],
//     queryFn: getAllIndustries,
//     refetchOnWindowFocus: "always",
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => deleteIndustry(id),
//   });

//   const industries = industriesResponse?.data || [];

//   const handleDelete = () => {
//     if (!selectedIndustry?.id) return;

//     deleteMutation.mutate(selectedIndustry.id, {
//       onSuccess: async () => {
//         toast.success("Industry deleted successfully");
//         await queryClient.invalidateQueries({ queryKey: ["industries"] });
//         setSelectedIndustry(null);
//       },
//       onError: (error: unknown) => {
//         let message = "Failed to delete industry";

//         if (typeof error === "object" && error !== null) {
//           const maybeError = error as {
//             response?: { data?: { message?: string } };
//             message?: string;
//           };

//           message = maybeError.response?.data?.message ?? maybeError.message ?? message;
//         }

//         toast.error(message);
//       },
//     });
//   };

//   return (
//     <div className="border rounded-lg overflow-x-auto bg-white">
//       {/* Responsive table wrapper */}
//       <div className="min-w-150 md:min-w-0 w-full">
//         <table className="w-full border-collapse text-sm md:text-base">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 md:p-3 text-left whitespace-nowrap">Icon</th>
//               <th className="p-2 md:p-3 text-left whitespace-nowrap">Name</th>
//               <th className="p-2 md:p-3 text-left whitespace-nowrap">Description</th>
//               <th className="p-2 md:p-3 text-left whitespace-nowrap">Created</th>
//               <th className="p-2 md:p-3 text-left whitespace-nowrap">Updated</th>
//               <th className="p-2 md:p-3 text-left whitespace-nowrap">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {industries.map((industry: any) => (
//               <tr key={industry.id} className="border-t hover:bg-gray-50 transition-colors">
//                 <td className="p-2 md:p-3 align-middle">
//                   {industry.icon ? (
//                     <img src={industry.icon} className="w-8 h-8 md:w-10 md:h-10 rounded object-cover" />
//                   ) : (
//                     <span className="text-gray-400">No Icon</span>
//                   )}
//                 </td>

//                 <td className="p-2 md:p-3 font-medium align-middle max-w-30 md:max-w-xs truncate">
//                   {industry.name}
//                 </td>
//                 <td className="p-2 md:p-3 text-gray-600 align-middle max-w-45 md:max-w-md truncate">
//                   {industry.description}
//                 </td>

//                 <td className="p-2 md:p-3 align-middle">
//                   <DateCell date={industry.createdAt} />
//                 </td>

//                 <td className="p-2 md:p-3 align-middle">
//                   <DateCell date={industry.updatedAt} />
//                 </td>

//                 <td className="p-2 md:p-3 space-x-2 md:space-x-3 align-middle">
//                   <Link
//                     href={`/admin/dashboard/industries-management/${industry.id}/edit`}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Edit
//                   </Link>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setSelectedIndustry({
//                         id: industry.id,
//                         name: industry.name,
//                       })
//                     }
//                     disabled={deleteMutation.isPending}
//                     className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {deleteMutation.isPending ? "Deleting..." : "Delete"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <AlertDialog
//         open={Boolean(selectedIndustry)}
//         onOpenChange={(open) => {
//           if (!open) setSelectedIndustry(null);
//         }}
//       >
//         <AlertDialogContent size="sm">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete industry?</AlertDialogTitle>
//             <AlertDialogDescription>
//               {selectedIndustry?.name
//                 ? `You are about to delete ${selectedIndustry.name}. This action cannot be undone.`
//                 : "This action cannot be undone."}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               variant="destructive"
//               onClick={handleDelete}
//               disabled={deleteMutation.isPending}
//             >
//               {deleteMutation.isPending ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteIndustry, getAllIndustries } from "@/src/services/industry.services";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DateCell from "../../shared/Cell/DataCell";

export default function IndustryList() {
  const queryClient = useQueryClient();
  const [selectedIndustry, setSelectedIndustry] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  const { data: industriesResponse } = useQuery({
    queryKey: ["industries"],
    queryFn: getAllIndustries,
    refetchOnWindowFocus: "always",
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIndustry(id),
  });

  const industries = industriesResponse?.data || [];

  const handleDelete = () => {
    if (!selectedIndustry?.id) return;

    deleteMutation.mutate(selectedIndustry.id, {
      onSuccess: async () => {
        toast.success("Industry deleted successfully");
        await queryClient.invalidateQueries({ queryKey: ["industries"] });
        setSelectedIndustry(null);
      },
      onError: (error: unknown) => {
        let message = "Failed to delete industry";

        if (typeof error === "object" && error !== null) {
          const err = error as any;
          message = err?.response?.data?.message ?? err?.message ?? message;
        }

        toast.error(message);
      },
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white shadow-sm">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm md:text-base">
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
            {industries.map((industry: any) => (
              <tr key={industry.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {industry.icon ? (
                    <img
                      src={industry.icon}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Icon</span>
                  )}
                </td>

                <td className="max-w-50 p-3 font-medium truncate">
                  {industry.name}
                </td>

                <td className="max-w-75 p-3 text-gray-600 truncate">
                  {industry.description}
                </td>

                <td className="p-3">
                  <DateCell date={industry.createdAt} />
                </td>

                <td className="p-3">
                  <DateCell date={industry.updatedAt} />
                </td>

                <td className="p-3 space-x-3">
                  <Link
                    href={`/admin/dashboard/industries-management/${industry.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      setSelectedIndustry({
                        id: industry.id,
                        name: industry.name,
                      })
                    }
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE / TABLET CARD VIEW ================= */}
      <div className="space-y-4 p-3 sm:p-4 lg:hidden">
        {industries.map((industry: any) => (
          <div
            key={industry.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {industry.icon ? (
                <img
                  src={industry.icon}
                  alt={industry.name}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-gray-100"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                  No Icon
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="wrap-break-word text-base leading-snug font-semibold text-gray-900 sm:text-lg">
                  {industry.name}
                </p>
                <p className="wrap-break-word mt-1 text-sm leading-6 text-gray-500 sm:text-[15px]">
                  {industry.description}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 sm:grid-cols-2">
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Created
                </span>
                <span className="wrap-break-word mt-1 block text-sm text-gray-700">
                  <DateCell date={industry.createdAt} />
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Updated
                </span>
                <span className="wrap-break-word mt-1 block text-sm text-gray-700">
                  <DateCell date={industry.updatedAt} />
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href={`/admin/dashboard/industries-management/${industry.id}/edit`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() =>
                  setSelectedIndustry({
                    id: industry.id,
                    name: industry.name,
                  })
                }
                disabled={deleteMutation.isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}

        {industries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
            No industries found.
          </div>
        )}
      </div>

      {/* ================= ALERT DIALOG ================= */}
      <AlertDialog
        open={Boolean(selectedIndustry)}
        onOpenChange={(open) => {
          if (!open) setSelectedIndustry(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete industry?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIndustry?.name
                ? `You are about to delete ${selectedIndustry.name}. This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}