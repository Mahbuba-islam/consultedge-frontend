"use client";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { createIndustryAction } from "@/src/services/industry.services";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

export default function IndustryCreateForm() {
  const [file, setFile] = useState<File | null>(null);

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

      const res = await createIndustryAction(fd);

      if (!res?.success) {
        alert(res?.message || "Failed to create industry");
        return;
      }

      alert("Industry created successfully!");

      form.reset();
      setFile(null);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <form.Field name="name">
        {(field) => (
          <AppField
            field={field}
            label="Industry Name"
            placeholder="e.g. Cybersecurity"
          />
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <AppField
            field={field}
            label="Description"
            placeholder="Short description"
          />
        )}
      </form.Field>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border rounded p-2 w-full"
        />
      </div>

      <AppSubmitButton isPending={form.state.isSubmitting}>
        Create Industry
      </AppSubmitButton>
    </form>
  );
}
