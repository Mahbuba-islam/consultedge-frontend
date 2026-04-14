"use client";
import ReviewModal from "@/components/modules/Review/ReviewModal";
import { createTestimonial } from "@/src/services/testimonial.services";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function GiveReview() {
  const params = useParams();
  const consultationId = typeof params.consultationId === "string" ? params.consultationId : Array.isArray(params.consultationId) ? params.consultationId[0] : "";

  console.log("consultationId:", consultationId); // Debug: confirm param

  const handleSubmit = async (rating: number, comment: string, consultationId: string) => {
    console.log('Submitting review', { rating, comment, consultationId }); // Debug: confirm handler
    try {
      await createTestimonial({ rating, comment, consultationId });
      toast.success("Review submitted successfully!");
      // Optionally close the modal or redirect here
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to submit review. Please try again.");
      console.error(error);
    }
  };

  return (
    <ReviewModal
      open={true}
      onSubmit={handleSubmit}
      onClose={() => {/* close modal logic */}}
      consultationId={consultationId}
    />
  );
}
