import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingDown, TrendingUp, Zap, CloudRain, AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { cn } from "@/lib/utils";

const generatePredictionData = (adjustment: number) => {
  return [
    { month: "Jan", actual: 2100, predicted: 2050, upper: 2150, lower: 1950 },
    { month: "Feb", actual: 2200, predicted: 2180, upper: 2280, lower: 2080 },
    { month: "Mar", actual: 2400, predicted: 2300, upper: 2400, lower: 2200 },
    { month: "Apr", actual: 2300, predicted: 2350, upper: 2450, lower: 2250 },
    { month: "May", actual: null, predicted: 2400 + adjustment, upper: 2520 + adjustment, lower: 2280 + adjustment },
    { month: "Jun", actual: null, predicted: 2450 + adjustment, upper: 2570 + adjustment, lower: 2330 + adjustment },
    { month: "Jul", actual: null, predicted: 2500 + adjustment, upper: 2620 + adjustment, lower: 2380 + adjustment },
  ];
};

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--primary))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--warning))",
  },
  upper: {
    label: "Upper Bound (95%)",
    color: "hsl(var(--destructive))",
  },
  lower: {
    label: "Lower Bound (95%)",
    color: "hsl(var(--success))",
  },
};

export const CarbonPredictionEngine = () => {
  const [scenarioAdjustment, setScenarioAdjustment] = useState([0]);
  const predictionData = generatePredictionData(scenarioAdjustment[0]);
  
  const confidence = 95;
  const modelAccuracy = 92.3;
  const carbonBudget = 15000;
  const projectedTotal = 16200;
  const budgetUsage = (projectedTotal / carbonBudget) * 100;

  return (
    <Card className="lg:col-span-2 border-2 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 pointer-events-none" />
      
      <CardHeader className="relative border-b bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              Carbon Prediction Engine
              <Badge variant="outline" className="ml-2 bg-gradient-to-r from-primary/20 to-accent/20">
                AI-Powered ML Model
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced forecasting with 95% confidence intervals
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{confidence}%</div>
            <div className="text-xs text-muted-foreground">Confidence</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-6 space-y-6">
        {/* Prediction Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Emissions Forecast</h3>
            <Badge variant="secondary" className="text-xs">
              Model Accuracy: {modelAccuracy}%
            </Badge>
          </div>

          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                
                {/* Confidence Band */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="url(#confidenceBand)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill="url(#confidenceBand)"
                  fillOpacity={0.3}
                />
                
                {/* Actual Data */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                
                {/* Predicted Data */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--warning))"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--warning))', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* What-If Scenario Slider */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">What-If Scenario</h3>
            <span className="text-xs text-muted-foreground">
              Adjustment: {scenarioAdjustment[0] > 0 ? '+' : ''}{scenarioAdjustment[0]} kg CO₂e
            </span>
          </div>
          <Slider
            value={scenarioAdjustment}
            onValueChange={setScenarioAdjustment}
            min={-500}
            max={500}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-500 kg (Optimistic)</span>
            <span>+500 kg (Pessimistic)</span>
          </div>
        </div>

        {/* Carbon Budget Alert System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Carbon Budget</h3>
              <Badge variant={budgetUsage > 100 ? "destructive" : budgetUsage > 85 ? "outline" : "secondary"}>
                {budgetUsage.toFixed(0)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Used / Total</span>
                <span className="font-medium">{projectedTotal.toLocaleString()} / {carbonBudget.toLocaleString()} kg CO₂e</span>
              </div>
              <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-1000 rounded-full",
                    budgetUsage > 100 ? "bg-gradient-to-r from-destructive to-destructive/80" :
                    budgetUsage > 85 ? "bg-gradient-to-r from-warning to-warning/80" :
                    "bg-gradient-to-r from-success to-success/80"
                  )}
                  style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
            {budgetUsage > 85 && (
              <div className="flex items-start gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Warning: Projected to exceed budget by {(projectedTotal - carbonBudget).toLocaleString()} kg CO₂e
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg border bg-card space-y-3">
            <h3 className="text-sm font-semibold">Early Warning System</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Budget Overrun Risk</span>
                <span className="text-warning font-bold">High</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
                <span className="text-xs">38 days until projected overrun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Factors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Weather</span>
            </div>
            <div className="text-xs text-muted-foreground">+3% impact</div>
          </div>
          
          <div className="p-3 rounded-lg border bg-gradient-to-br from-warning/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-xs font-semibold">Supply Chain</span>
            </div>
            <div className="text-xs text-muted-foreground">+8% risk</div>
          </div>
          
          <div className="p-3 rounded-lg border bg-gradient-to-br from-success/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-xs font-semibold">Efficiency</span>
            </div>
            <div className="text-xs text-muted-foreground">-5% gained</div>
          </div>
          
          <div className="p-3 rounded-lg border bg-gradient-to-br from-accent/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold">Model Updates</span>
            </div>
            <div className="text-xs text-muted-foreground">Live</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
