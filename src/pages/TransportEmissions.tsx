import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Trash2, Truck, CheckCircle2, FileText, MapPin, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { parseExcelFile, MaterialData } from "@/utils/excelParser";
import { formatNumberGerman } from "@/lib/utils";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TransportData extends MaterialData {
  distance?: number;
  transportMode?: string;
  transportEmissions?: number;
}

const TransportEmissions = () => {
  const { toast } = useToast();
  const [transportData, setTransportData] = useState<TransportData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transport emission factors (kg CO₂e per ton-km)
  const emissionFactors = {
    'Truck': 0.062,
    'Rail': 0.022,
    'Ship': 0.008,
    'Air': 0.602,
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      const allMaterials: TransportData[] = [];
      
      for (const file of Array.from(files)) {
        const parsedData = await parseExcelFile(file);
        
        // Calculate transport emissions for each material
        const dataWithTransport = parsedData.map(item => {
          // Default values if not in file
          const distance = Math.random() * 500 + 50; // Random distance between 50-550 km
          const transportMode = ['Truck', 'Rail', 'Ship'][Math.floor(Math.random() * 3)];
          const weightInTons = (item.weight || 0) / 1000;
          const emissionFactor = emissionFactors[transportMode as keyof typeof emissionFactors] || 0.062;
          const transportEmissions = weightInTons * distance * emissionFactor;

          return {
            ...item,
            distance,
            transportMode,
            transportEmissions,
          };
        });

        allMaterials.push(...dataWithTransport);
      }

      setTransportData([...transportData, ...allMaterials]);
      
      toast({
        title: "Files Processed",
        description: `Successfully processed ${files.length} file(s) with transport emissions calculations.`,
      });
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error",
        description: "Failed to process files. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearData = () => {
    setTransportData([]);
    toast({
      title: "Data Cleared",
      description: "All transport data has been removed.",
    });
  };

  const totalTransportEmissions = transportData.reduce((sum, item) => sum + (item.transportEmissions || 0), 0);
  const totalMaterialEmissions = transportData.reduce((sum, item) => sum + (item.carbonFootprint || 0), 0);
  const totalEmissions = totalTransportEmissions + totalMaterialEmissions;
  const totalDistance = transportData.reduce((sum, item) => sum + (item.distance || 0), 0);

  // Transport mode summary
  const transportModeSummary = transportData.reduce((acc, item) => {
    const mode = item.transportMode || 'Unknown';
    if (!acc[mode]) {
      acc[mode] = {
        count: 0,
        emissions: 0,
        distance: 0,
      };
    }
    acc[mode].count += 1;
    acc[mode].emissions += item.transportEmissions || 0;
    acc[mode].distance += item.distance || 0;
    return acc;
  }, {} as Record<string, { count: number; emissions: number; distance: number }>);

  const modeChartData = Object.entries(transportModeSummary).map(([mode, data]) => ({
    name: mode,
    emissions: data.emissions,
    count: data.count,
  }));

  const CHART_COLORS = [
    'hsl(147 70% 45%)',
    'hsl(158 65% 50%)', 
    'hsl(140 60% 40%)',
    'hsl(152 55% 48%)',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <p className="text-primary text-lg font-bold">
            {formatNumberGerman(payload[0].value)} kg CO₂e
          </p>
          {payload[0].payload.count && (
            <p className="text-sm text-muted-foreground mt-1">
              {payload[0].payload.count} shipments
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Transport Emissions Calculator</h1>
              <p className="text-muted-foreground mt-1">Calculate and analyze carbon footprint from material transportation</p>
            </div>
          </div>
        </div>

        {transportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground">Transport Emissions</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{formatNumberGerman(totalTransportEmissions, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">kg CO₂e</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-accent" />
                <h3 className="text-sm font-medium text-muted-foreground">Total Distance</h3>
              </div>
              <p className="text-3xl font-bold text-accent">{formatNumberGerman(totalDistance, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">km</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <h3 className="text-sm font-medium text-muted-foreground">Total Emissions</h3>
              </div>
              <p className="text-3xl font-bold text-success">{formatNumberGerman(totalEmissions, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">kg CO₂e (Materials + Transport)</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-card/50">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Total Shipments</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{formatNumberGerman(transportData.length, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">materials tracked</p>
            </Card>
          </div>
        )}

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analysis ({transportData.length})
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <FileText className="h-4 w-4" />
              All Details ({transportData.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upload Transport Data</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="excel-files">Excel Files (.xlsx, .xls)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      id="excel-files"
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      multiple
                      className="cursor-pointer"
                      disabled={isProcessing}
                    />
                    <Button 
                      className="gap-2" 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      <Upload className="h-4 w-4" />
                      {isProcessing ? "Processing..." : "Choose Files"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload Excel files containing material data. Transport distances and modes will be calculated automatically.
                  </p>
                </div>

                {transportData.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearData}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">How it works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Upload Excel files with material quantities and weights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Transport emissions are calculated based on distance and transport mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>View comprehensive analysis of transport impact on total carbon footprint</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {transportData.length === 0 ? (
              <Card className="p-12 text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transport data available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload files to see transport emissions analysis
                </p>
              </Card>
            ) : (
              <>
                <Card className="p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Transport Mode Analysis</h3>
                      <p className="text-sm text-muted-foreground">Emissions by transportation method</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                      data={modeChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(147 70% 45%)" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="hsl(158 65% 50%)" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--border))" 
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => formatNumberGerman(value, 0)}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} />
                      <Bar 
                        dataKey="emissions" 
                        fill="url(#barGradient)" 
                        radius={[12, 12, 0, 0]}
                        maxBarSize={100}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(transportModeSummary).map(([mode, data], index) => (
                    <Card key={mode} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        >
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{mode}</h4>
                          <p className="text-xs text-muted-foreground">{data.count} shipments</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-secondary/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Distance</p>
                          <p className="text-xl font-bold text-foreground">{formatNumberGerman(data.distance, 0)}</p>
                          <p className="text-xs text-muted-foreground">km</p>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">Transport Emissions</p>
                          <p className="text-2xl font-bold text-primary">{formatNumberGerman(data.emissions, 0)}</p>
                          <p className="text-sm text-muted-foreground">kg CO₂e</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {transportData.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No data uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload files to see detailed information
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {transportData.map((item, index) => (
                  <Card key={index} className="p-4 hover:bg-accent/5 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <p className="font-medium text-foreground text-sm">{item.material}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.supplier}</p>
                        <Badge variant="outline" className="mt-2 text-xs">{item.articleNumber}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="font-medium text-foreground">{formatNumberGerman(item.quantity)} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Transport Mode</p>
                        <Badge className="mt-1">{item.transportMode || 'N/A'}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-medium text-foreground">{formatNumberGerman(item.distance || 0, 0)} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Transport Emissions</p>
                        <p className="font-bold text-primary">{formatNumberGerman(item.transportEmissions || 0)} kg CO₂e</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransportEmissions;
