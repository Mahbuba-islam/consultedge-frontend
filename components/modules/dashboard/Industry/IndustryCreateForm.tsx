"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { ImagePlus, Sparkles, Trash2 } from "lucide-react";

import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { createIndustry } from "@/src/services/industry.services";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return (
      maybeError.response?.data?.message ??
      maybeError.message ??
      "Failed to create industry"
    );
  }

  return "Failed to create industry";
};

export default function IndustryCreateForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const fd = new FormData();
      fd.append("name", value.name);
      fd.append("description", value.description);
      if (file) fd.append("file", file);

      try {
        const res = await createIndustry(fd);

        if (!res?.success) {
          toast.error(res?.message || "Failed to create industry", {
            description: "Please review the details and try again.",
          });
          return;
        }
        const industryName = value.name.trim() || "Your new industry";

        toast.success("Industry created successfully ✨", {
          description: `${industryName} is now ready to manage from the dashboard.`,
        });

        form.reset();
        handleFileChange(null);
        router.push("/admin/dashboard/industries-management");
        router.refresh();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error), {
          description: "The industry could not be created right now.",
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Name */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
        <form.Field name="name">
          {(field) => (
            <AppField
              field={field}
              label="Industry Name"
              placeholder="e.g. Cybersecurity"
            />
          )}
        </form.Field>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
        <form.Field name="description">
          {(field) => (
            <AppField
              field={field}
              label="Description"
              placeholder="Short description shown to clients"
            />
          )}
        </form.Field>
      </div>

      {/* Icon upload */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <ImagePlus className="size-4 text-blue-600 dark:text-cyan-300" />
          Industry icon
        </label>

        {previewUrl ? (
          <div className="flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="relative size-16 overflow-hidden rounded-xl ring-1 ring-slate-200/70 dark:ring-white/10">
              <Image
                src={previewUrl}
                alt="Icon preview"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {file?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {file ? `${Math.round(file.size / 1024)} KB` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="inline-flex items-center gap-1 rounded-full border border-rose-200/70 bg-rose-50/70 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <label
            htmlFor="industry-icon"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200/70 bg-white/40 p-6 text-center transition hover:border-cyan-400/60 hover:bg-cyan-50/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/5"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25">
              <ImagePlus className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click to upload an icon
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, or SVG · up to a few hundred KB
            </p>
          </label>
        )}

        <input
          id="industry-icon"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      <AppSubmitButton
        isPending={form.state.isSubmitting}
        className="h-11 w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25 hover:from-blue-700 hover:to-cyan-600"
      >
        <Sparkles className="mr-2 size-4" />
        Create industry
      </AppSubmitButton>
    </form>
  );
}
