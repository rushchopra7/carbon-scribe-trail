import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const radarData = [
  { regulation: "CSRD", current: 73, upcoming: 85, fullMark: 100 },
  { regulation: "Taxonomy", current: 68, upcoming: 90, fullMark: 100 },
  { regulation: "CSDDD", current: 45, upcoming: 75, fullMark: 100 },
  { regulation: "CBAM", current: 52, upcoming: 70, fullMark: 100 },
  { regulation: "SFDR", current: 80, upcoming: 85, fullMark: 100 },
];

const chartConfig = {
  current: {
    label: "Current Compliance",
    color: "hsl(var(--primary))",
  },
  upcoming: {
    label: "Required by 2026",
    color: "hsl(var(--warning))",
  },
};

export const RegulationRadarChart = () => {
  return (
    <Card className="border-2 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-primary/5 pointer-events-none" />
      
      <CardHeader className="relative">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          Regulation Radar
          <Badge variant="outline" className="text-xs bg-warning/10">
            Predictive
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">EU Policy Change Timeline</p>
      </CardHeader>
      
      <CardContent className="relative pt-0">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <defs>
                <linearGradient id="radarGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="radarGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="regulation" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Current Compliance"
                dataKey="current"
                stroke="hsl(var(--primary))"
                fill="url(#radarGradient1)"
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Radar
                name="Required by 2026"
                dataKey="upcoming"
                stroke="hsl(var(--warning))"
                fill="url(#radarGradient2)"
                fillOpacity={0.6}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Upcoming</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
