import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconComponent } from "@/src/lib/iconMapper";
import { cn } from "@/src/lib/utils";
import { createElement } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string;
  description?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  iconName,
  description,
  className,
}: StatsCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-neutral-200 hover:shadow-lg transition-all rounded-xl",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-700">
          {title}
        </CardTitle>

        {/* Icon Container */}
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-accent/20 flex items-center justify-center text-primary-600">
          {createElement(getIconComponent(iconName), {
            className: "w-5 h-5",
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        <div className="text-3xl font-bold text-neutral-900 tracking-tight">
          {value}
        </div>

        {description && (
          <p className="text-xs font-medium text-neutral-600">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;