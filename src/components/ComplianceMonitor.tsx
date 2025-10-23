import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ComplianceStatus = "compliant" | "warning" | "critical";

interface ComplianceItem {
  requirement: string;
  status: ComplianceStatus;
  deadline?: string;
}

const complianceItems: ComplianceItem[] = [
  { requirement: "CSRD Annual Disclosure", status: "compliant", deadline: "2025-03-31" },
  { requirement: "Scope 3 Emissions Reporting", status: "warning", deadline: "2025-06-15" },
  { requirement: "EU Taxonomy Alignment", status: "compliant" },
  { requirement: "Double Materiality Assessment", status: "critical", deadline: "2025-02-28" },
  { requirement: "Supply Chain Due Diligence", status: "warning" },
];

export const ComplianceMonitor = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("EU");
  
  const complianceScore = 73;
  const alertCount = complianceItems.filter(item => item.status !== "compliant").length;
  
  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return "text-success";
      case "warning":
        return "text-warning";
      case "critical":
        return "text-destructive";
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "critical":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusBg = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return "bg-success/10";
      case "warning":
        return "bg-warning/10";
      case "critical":
        return "bg-destructive/10";
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              Compliance Monitor
              <Badge variant="outline" className="ml-2 text-xs bg-primary/10">
                AI-Powered
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">CSRD & EU Taxonomy</p>
          </div>
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground animate-pulse" />
            {alertCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold animate-pulse">
                {alertCount}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Traffic Light Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className={cn(
                "h-3 w-3 rounded-full transition-all duration-500",
                complianceScore >= 80 ? "bg-success animate-pulse shadow-lg shadow-success/50" : "bg-muted"
              )} />
              <div className={cn(
                "h-3 w-3 rounded-full transition-all duration-500",
                complianceScore >= 50 && complianceScore < 80 ? "bg-warning animate-pulse shadow-lg shadow-warning/50" : "bg-muted"
              )} />
              <div className={cn(
                "h-3 w-3 rounded-full transition-all duration-500",
                complianceScore < 50 ? "bg-destructive animate-pulse shadow-lg shadow-destructive/50" : "bg-muted"
              )} />
            </div>
            <div>
              <p className="text-sm font-semibold">Overall Status</p>
              <p className="text-xs text-muted-foreground">
                {complianceScore >= 80 ? "Fully Compliant" : complianceScore >= 50 ? "Action Required" : "Critical Issues"}
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Compliance Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{complianceScore}%</span>
              <span className="text-success text-sm">↑ 8%</span>
            </div>
          </div>
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${complianceScore}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Country Selector */}
        <div className="flex gap-2">
          {["EU", "DE", "FR", "NL"].map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                selectedCountry === country
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Expandable Checklist */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
          >
            <span className="text-sm font-semibold">Compliance Checklist</span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {expanded && (
            <div className="border-t divide-y animate-in slide-in-from-top duration-300">
              {complianceItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 flex items-center gap-3 transition-colors hover:bg-accent/30",
                    getStatusBg(item.status)
                  )}
                >
                  <div className={getStatusColor(item.status)}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.requirement}</p>
                    {item.deadline && (
                      <p className="text-xs text-muted-foreground">Due: {item.deadline}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Future Impact Predictor */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Upcoming Impact</p>
              <p className="text-xs text-muted-foreground mt-1">
                New CSRD requirements in Q2 2025 may require additional Scope 3 data collection
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
