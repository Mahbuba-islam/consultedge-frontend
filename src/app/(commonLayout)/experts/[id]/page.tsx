import { notFound } from "next/navigation";

import ExpertDetails from "@/components/modules/Experts/ExpertDetails";
import { getUserInfo } from "@/src/services/auth.services";
import { getExpertById } from "@/src/services/expert.services";
import { getAllExpertSchedules } from "@/src/services/expertSchedule";
import { getTestimonialsByExpert } from "@/src/services/testimonial.services";

const ExpertDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const [expert, currentUser, testimonials, availabilityResponse] = await Promise.all([
      getExpertById(id),
      getUserInfo(),
      getTestimonialsByExpert(id).catch(() => []),
      getAllExpertSchedules({
        expertId: id,
        isBooked: false,
        isDeleted: false,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      }).catch(() => ({ data: [] })),
    ]);

    const availability = Array.isArray(availabilityResponse?.data)
      ? availabilityResponse.data
      : [];

    return (
      <ExpertDetails
        expert={expert}
        availability={availability}
        testimonials={testimonials}
        isLoggedIn={Boolean(currentUser)}
        userRole={currentUser?.role ?? null}
      />
    );
  } catch {
    notFound();
  }
};

export default ExpertDetailsPage;