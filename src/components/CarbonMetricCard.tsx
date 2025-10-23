import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarbonMetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const CarbonMetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon,
  variant = "default" 
}: CarbonMetricCardProps) => {
  const trendColor = trend && trend > 0 ? "text-destructive" : "text-success";
  
  return (
    <Card className={cn(
      "p-6 transition-all duration-300 hover:shadow-lg border-l-4",
      variant === "success" && "border-l-success bg-success/5",
      variant === "warning" && "border-l-warning bg-warning/5",
      variant === "destructive" && "border-l-destructive bg-destructive/5",
      variant === "default" && "border-l-primary bg-gradient-to-br from-card to-secondary/20"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          {trend !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", trendColor)}>
              {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === "success" && "bg-success/10 text-success",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "destructive" && "bg-destructive/10 text-destructive",
          variant === "default" && "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
