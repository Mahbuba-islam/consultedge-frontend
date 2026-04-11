"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UploadAttachmentButtonProps {
  disabled?: boolean;
  onSelectFile: (file: File) => void | Promise<void>;
}

export default function UploadAttachmentButton({
  disabled = false,
  onSelectFile,
}: UploadAttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void onSelectFile(file);
          }

          event.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="size-4" />
        <span className="sr-only">Upload attachment</span>
      </Button>
    </>
  );
}
