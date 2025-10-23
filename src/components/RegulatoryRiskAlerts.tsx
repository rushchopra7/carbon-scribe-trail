import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  daysUntil: number;
  regulation: string;
}

const alerts: RiskAlert[] = [
  {
    id: "1",
    title: "Double Materiality Assessment Due",
    description: "Complete assessment required for CSRD compliance. Missing data on 3 material topics.",
    severity: "high",
    daysUntil: 28,
    regulation: "CSRD"
  },
  {
    id: "2",
    title: "Scope 3 Data Gap Detected",
    description: "Transportation emissions data incomplete for Q1. AI model confidence will decrease.",
    severity: "medium",
    daysUntil: 45,
    regulation: "GHG Protocol"
  },
  {
    id: "3",
    title: "EU Taxonomy Update Available",
    description: "New technical screening criteria published. Review alignment assessment.",
    severity: "low",
    daysUntil: 90,
    regulation: "EU Taxonomy"
  },
];

export const RegulatoryRiskAlerts = () => {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissed([...dismissed, id]);
    toast.success("Alert dismissed");
  };

  const handleGenerateReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating compliance report...',
        success: 'Report generated successfully!',
        error: 'Failed to generate report',
      }
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-destructive/50 bg-destructive/5";
      case "medium":
        return "border-warning/50 bg-warning/5";
      case "low":
        return "border-primary/50 bg-primary/5";
      default:
        return "";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const visibleAlerts = alerts.filter(alert => !dismissed.includes(alert.id));

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              Regulatory Risk Alerts
              <Badge variant="outline" className="text-xs bg-destructive/10">
                {visibleAlerts.length} Active
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Priority actions required</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {visibleAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No active alerts</p>
            <p className="text-xs mt-1">All regulatory requirements are on track</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span className="text-sm font-semibold">{alert.title}</span>
                <Badge variant={getSeverityBadge(alert.severity)} className="text-xs">
                  {alert.severity}
                </Badge>
              </AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="text-xs">{alert.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{alert.daysUntil} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{alert.regulation}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleDismiss(alert.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ))
        )}

        <Button 
          onClick={handleGenerateReport}
          className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <FileText className="h-4 w-4 mr-2 animate-spin" />
          Generate Compliance Report
        </Button>

        {/* Sparklines for trends */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="p-2 rounded border bg-card">
            <div className="text-xs font-medium mb-1">CSRD</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs text-success">+12%</span>
            </div>
          </div>
          <div className="p-2 rounded border bg-card">
            <div className="text-xs font-medium mb-1">Taxonomy</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs text-success">+8%</span>
            </div>
          </div>
          <div className="p-2 rounded border bg-card">
            <div className="text-xs font-medium mb-1">CSDDD</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-warning" />
              <span className="text-xs text-warning">+3%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
