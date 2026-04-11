"use client";

import { useMemo } from "react";

import TestimonialCard from "@/components/modules/shared/TestimonialCard";
import { Card, CardContent } from "@/components/ui/card";
import { useReviewOverrides } from "@/src/hooks/useReviewOverrides";
import type { ITestimonial } from "@/src/types/testimonial.types";

interface ExpertTestimonialsSectionProps {
  testimonials: ITestimonial[];
}

export default function ExpertTestimonialsSection({
  testimonials,
}: ExpertTestimonialsSectionProps) {
  const { mergedReviews } = useReviewOverrides(testimonials);

  const visibleReviews = useMemo(
    () => mergedReviews.filter((review) => !review.isHidden),
    [mergedReviews],
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visibleReviews.length > 0 ? (
        visibleReviews.slice(0, 3).map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))
      ) : (
        <Card className="md:col-span-2 xl:col-span-3">
          <CardContent className="py-8 text-center text-muted-foreground">
            This expert has no public testimonials to display right now.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
