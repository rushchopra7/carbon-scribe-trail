import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileCheck, Database } from "lucide-react";

interface AuditEntry {
  timestamp: string;
  action: string;
  source: string;
  verified: boolean;
}

const mockAuditData: AuditEntry[] = [
  {
    timestamp: "2024-10-23 14:32",
    action: "Material emission factor updated",
    source: "Ökobaudat API",
    verified: true
  },
  {
    timestamp: "2024-10-23 13:15",
    action: "EPD document uploaded",
    source: "Supplier Portal",
    verified: true
  },
  {
    timestamp: "2024-10-23 11:45",
    action: "Transport data verified",
    source: "Manual Entry",
    verified: false
  }
];

export const AuditTrail = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Carbon Data Audit Trail</h3>
      </div>
      
      <div className="space-y-3">
        {mockAuditData.map((entry, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="mt-0.5">
              {entry.verified ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <FileCheck className="h-5 w-5 text-warning" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground">{entry.action}</p>
                {entry.verified && (
                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{entry.timestamp}</span>
                <span>•</span>
                <span>{entry.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
