import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileCheck, CheckCircle2, FileText, Trash2, Building2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { parseExcelFile, MaterialData } from "@/utils/excelParser";
import { formatNumberGerman } from "@/lib/utils";

interface CompanySummary {
  company: string;
  totalWeight: number;
  totalCarbonFootprint: number;
  materialCount: number;
}

interface MaterialSummary {
  material: string;
  totalWeight: number;
  totalCarbonFootprint: number;
  suppliers: string[];
  quantity: number;
  unit: string;
}

const SupplierPortal = () => {
  const { toast } = useToast();
  const [materialData, setMaterialData] = useState<MaterialData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate company summaries
  const companySummaries = materialData.reduce((acc, item) => {
    const existing = acc.find(s => s.company === item.supplier);
    
    if (existing) {
      existing.totalWeight += item.weight || 0;
      existing.totalCarbonFootprint += item.carbonFootprint || 0;
      existing.materialCount += 1;
    } else {
      acc.push({
        company: item.supplier,
        totalWeight: item.weight || 0,
        totalCarbonFootprint: item.carbonFootprint || 0,
        materialCount: 1,
      });
    }
    return acc;
  }, [] as CompanySummary[]);

  // Calculate material summaries
  const materialSummaries = materialData.reduce((acc, item) => {
    const existing = acc.find(s => s.material === item.material);
    
    if (existing) {
      existing.totalWeight += item.weight || 0;
      existing.totalCarbonFootprint += item.carbonFootprint || 0;
      existing.quantity += item.quantity;
      if (!existing.suppliers.includes(item.supplier)) {
        existing.suppliers.push(item.supplier);
      }
    } else {
      acc.push({
        material: item.material,
        totalWeight: item.weight || 0,
        totalCarbonFootprint: item.carbonFootprint || 0,
        suppliers: [item.supplier],
        quantity: item.quantity,
        unit: item.unit,
      });
    }
    return acc;
  }, [] as MaterialSummary[]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      const allMaterials: MaterialData[] = [];
      
      for (const file of Array.from(files)) {
        const parsedData = await parseExcelFile(file);
        allMaterials.push(...parsedData);
      }

      setMaterialData([...materialData, ...allMaterials]);
      
      toast({
        title: "Files Processed Successfully",
        description: `Processed ${files.length} file(s) with ${allMaterials.length} materials. Carbon footprints calculated.`,
      });

      e.target.value = "";
    } catch (error) {
      toast({
        title: "Error Processing Files",
        description: "Failed to parse Excel files. Please ensure they have the correct format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = () => {
    setMaterialData([]);
    toast({
      title: "Data Cleared",
      description: "All uploaded data has been removed.",
    });
  };

  const totalCarbonFootprint = materialData.reduce((sum, item) => sum + (item.carbonFootprint || 0), 0);
  const totalWeight = materialData.reduce((sum, item) => sum + (item.weight || 0), 0);

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

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Carbon Footprint Analysis Portal</h2>
          <p className="text-muted-foreground">Upload Excel files to calculate company-wise and material-wise carbon footprints</p>
        </div>

        {/* Summary Cards */}
        {materialData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <p className="text-sm text-muted-foreground mb-2">Total Materials</p>
              <p className="text-3xl font-bold text-foreground">{formatNumberGerman(materialData.length, 0)}</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <p className="text-sm text-muted-foreground mb-2">Total Weight</p>
              <p className="text-3xl font-bold text-foreground">{formatNumberGerman(totalWeight)}</p>
              <p className="text-sm text-muted-foreground">kg</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <p className="text-sm text-muted-foreground mb-2">Total Carbon Footprint</p>
              <p className="text-3xl font-bold text-primary">{formatNumberGerman(totalCarbonFootprint)}</p>
              <p className="text-sm text-muted-foreground">kg CO₂e</p>
            </Card>
          </div>
        )}

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="companies">
              By Company ({companySummaries.length})
            </TabsTrigger>
            <TabsTrigger value="materials">
              By Material ({materialSummaries.length})
            </TabsTrigger>
            <TabsTrigger value="details">
              All Details ({materialData.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upload Excel Files</h3>
              
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
                    Upload multiple Excel files (e.g., weight and quantity data). Files should contain: Lieferant, Artikel-Nummer, Artikel, Menge, Einheit columns.
                  </p>
                </div>

                {materialData.length > 0 && (
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
                  <span>Upload your Excel files containing material quantities and weights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Carbon footprints are automatically calculated based on material types</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>View aggregated data by company or by material type</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            {companySummaries.length === 0 ? (
              <Card className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No company data available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload Excel files to see company-wise summaries
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companySummaries.sort((a, b) => b.totalCarbonFootprint - a.totalCarbonFootprint).map((summary, index) => (
                  <Card key={index} className="p-6 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-foreground truncate" title={summary.company}>
                            {summary.company}
                          </h4>
                          <Badge variant="secondary" className="mt-2">
                            {formatNumberGerman(summary.materialCount, 0)} materials
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-secondary/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Weight</p>
                          <p className="text-xl font-bold text-foreground">{formatNumberGerman(summary.totalWeight)}</p>
                          <p className="text-xs text-muted-foreground">kg</p>
                        </div>
                        
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">Carbon Footprint</p>
                          <p className="text-2xl font-bold text-primary">{formatNumberGerman(summary.totalCarbonFootprint)}</p>
                          <p className="text-sm text-muted-foreground">kg CO₂e</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            {materialSummaries.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No material data available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload Excel files to see material-wise summaries
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {materialSummaries.sort((a, b) => b.totalCarbonFootprint - a.totalCarbonFootprint).map((summary, index) => (
                  <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{summary.material}</h4>
                        <div className="flex flex-wrap gap-2">
                          {summary.suppliers.map((supplier, idx) => (
                            <Badge key={idx} variant="outline">{supplier}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-secondary/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                          <p className="text-lg font-bold text-foreground">{formatNumberGerman(summary.quantity)}</p>
                          <p className="text-xs text-muted-foreground">{summary.unit}</p>
                        </div>
                        <div className="p-3 bg-secondary/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Weight</p>
                          <p className="text-lg font-bold text-foreground">{formatNumberGerman(summary.totalWeight)}</p>
                          <p className="text-xs text-muted-foreground">kg</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 md:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Carbon Footprint</p>
                          <p className="text-2xl font-bold text-primary">{formatNumberGerman(summary.totalCarbonFootprint)}</p>
                          <p className="text-sm text-muted-foreground">kg CO₂e</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {materialData.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No data uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload Excel files to see detailed information
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {materialData.map((item, index) => (
                  <Card key={index} className="p-4 hover:bg-accent/5 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
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
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="font-medium text-foreground">{formatNumberGerman(item.weight || 0)} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Carbon</p>
                        <p className="font-bold text-primary">{formatNumberGerman(item.carbonFootprint || 0)} kg CO₂e</p>
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

export default SupplierPortal;
