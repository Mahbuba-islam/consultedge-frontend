import { CalendarDays, MessageSquareQuote, Star, ThumbsUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ITestimonial } from "@/src/types/testimonial.types";

interface ReviewSummaryCardsProps {
  reviews: ITestimonial[];
}

const formatLatestDate = (value: Date | null) => {
  if (!value) {
    return "No reviews yet";
  }

  return value.toLocaleDateString();
};

export default function ReviewSummaryCards({ reviews }: ReviewSummaryCardsProps) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews
    : 0;
  const positiveReviews = reviews.filter((review) => Number(review.rating || 0) >= 4).length;
  const fiveStarReviews = reviews.filter((review) => Number(review.rating || 0) >= 5).length;

  const latestReviewDate = reviews.reduce<Date | null>((latest, review) => {
    const parsedDate = new Date(review.createdAt);

    if (Number.isNaN(parsedDate.getTime())) {
      return latest;
    }

    if (!latest || parsedDate > latest) {
      return parsedDate;
    }

    return latest;
  }, null);

  const summaryItems = [
    {
      label: "Total reviews",
      value: totalReviews.toString(),
      hint: "All visible client feedback",
      icon: MessageSquareQuote,
      accent: "from-blue-50 to-white text-blue-700 dark:from-blue-500/10 dark:to-slate-900/80 dark:text-blue-300",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
      border: "border-blue-200/60 dark:border-blue-500/20",
    },
    {
      label: "Average rating",
      value: `${averageRating.toFixed(1)} / 5`,
      hint: "Calculated from submitted scores",
      icon: Star,
      accent: "from-amber-50 to-white text-amber-600 dark:from-amber-500/10 dark:to-slate-900/80 dark:text-amber-300",
      iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
      border: "border-amber-200/60 dark:border-amber-500/20",
    },
    {
      label: "Positive sentiment",
      value: `${totalReviews ? Math.round((positiveReviews / totalReviews) * 100) : 0}%`,
      hint: `${positiveReviews} reviews rated 4★ or higher`,
      icon: ThumbsUp,
      accent: "from-emerald-50 to-white text-emerald-700 dark:from-emerald-500/10 dark:to-slate-900/80 dark:text-emerald-300",
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      border: "border-emerald-200/60 dark:border-emerald-500/20",
    },
    {
      label: "Latest feedback",
      value: formatLatestDate(latestReviewDate),
      hint: `${fiveStarReviews} five-star reviews so far`,
      icon: CalendarDays,
      accent: "from-sky-50 to-white text-sky-700 dark:from-cyan-500/10 dark:to-slate-900/80 dark:text-cyan-300",
      iconBg: "bg-sky-100 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-300",
      border: "border-sky-200/60 dark:border-cyan-500/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label} className={`bg-linear-to-br ${item.accent} ${item.border} shadow-sm`}>
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              </div>

              <div className={`rounded-2xl p-2 shadow-sm ${item.iconBg}`}>
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
