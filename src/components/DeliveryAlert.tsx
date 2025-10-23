import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface DeliveryAlertProps {
  material: string;
  carbonImpact: number;
  alternative: string;
  savings: number;
}

export const DeliveryAlert = ({ material, carbonImpact, alternative, savings }: DeliveryAlertProps) => {
  return (
    <Alert className="border-warning bg-warning/10">
      <AlertTriangle className="h-5 w-5 text-warning" />
      <AlertTitle className="text-warning font-semibold">High Carbon Delivery Detected</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-foreground mb-3">
          <span className="font-medium">{material}</span> has a carbon footprint of{" "}
          <span className="font-bold text-warning">{carbonImpact} kg CO₂e</span>
        </p>
        <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
          <div>
            <p className="text-sm font-medium text-foreground">Consider alternative:</p>
            <p className="text-sm text-success font-semibold">{alternative}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Save {savings}% carbon emissions
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-2">
            View Details <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
