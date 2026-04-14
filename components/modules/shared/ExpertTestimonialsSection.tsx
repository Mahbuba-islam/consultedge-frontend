import { useMemo } from "react";

import TestimonialCard from "@/components/modules/shared/TestimonialCard";
import { Card, CardContent } from "@/components/ui/card";
import type { ITestimonial } from "@/src/types/testimonial.types";

interface ExpertTestimonialsSectionProps {
  testimonials: ITestimonial[];
}

export default function ExpertTestimonialsSection({
  testimonials,
}: ExpertTestimonialsSectionProps) {
  const visibleReviews = useMemo(() => {
    return testimonials
      .filter((review) => !review.isHidden) // only if backend supports it
      .slice(0, 3);
  }, [testimonials]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visibleReviews.length > 0 ? (
        visibleReviews.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
          />
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