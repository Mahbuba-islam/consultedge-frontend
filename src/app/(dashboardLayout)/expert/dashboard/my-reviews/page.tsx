import ExpertReviewsPanel from "@/components/modules/dashboard/ExpertReviewsPanel";
import { getMe } from "@/src/services/auth.services";
import { getTestimonialsByExpert } from "@/src/services/testimonial.services";

export default async function MyReviewsPage() {
  const profile = await getMe();
console.log('get me', profile);
  const expertId = profile?.expert?.id ?? null;
console.log('expertId',expertId);
  const reviews = expertId
    ? await getTestimonialsByExpert(expertId)
  : [];
console.log("SERVER REVIEWS:", reviews);
  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <ExpertReviewsPanel profile={profile} reviews={reviews} />
    </div>
  );
}
