import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const MaterialSearch = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [manualMaterial, setManualMaterial] = useState({
    name: "",
    emission: "",
    unit: "kg CO₂e/kg"
  });
  const [selectedMaterials, setSelectedMaterials] = useState<Array<{ name: string; emission: number; unit: string }>>([]);

  const okobaudatMaterials: Array<{ name: string; emission: number; unit: string }> = [
    { name: "Concrete C30/37", emission: 280, unit: "kg CO₂e/ton" },
    { name: "Steel Rebar", emission: 1900, unit: "kg CO₂e/ton" },
    { name: "Timber Beam", emission: 60, unit: "kg CO₂e/ton" },
    { name: "Ceramic Brick", emission: 220, unit: "kg CO₂e/ton" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Add Material</h3>
      
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Ökobaudat Lookup</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Ökobaudat database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {okobaudatMaterials
              .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((m) => (
                <div key={m.name} className="p-3 border rounded-lg hover:bg-secondary transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{m.name}</p>
                      <p className="text-sm text-muted-foreground">{m.emission} {m.unit}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMaterials((prev) => [...prev, { name: m.name, emission: m.emission, unit: m.unit }]);
                        toast({ title: "Material added", description: `${m.name} added to project.` });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="material-name">Material Name</Label>
              <Input
                id="material-name"
                placeholder="e.g., Custom Concrete Mix"
                value={manualMaterial.name}
                onChange={(e) => setManualMaterial({...manualMaterial, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="emission-factor">Emission Factor</Label>
              <div className="flex gap-2">
                <Input
                  id="emission-factor"
                  type="number"
                  placeholder="0.00"
                  value={manualMaterial.emission}
                  onChange={(e) => setManualMaterial({...manualMaterial, emission: e.target.value})}
                />
                <Input
                  value={manualMaterial.unit}
                  onChange={(e) => setManualMaterial({...manualMaterial, unit: e.target.value})}
                  className="w-32"
                />
              </div>
            </div>
            
            <Button
              className="w-full"
              onClick={() => {
                const emissionVal = parseFloat(manualMaterial.emission);
                if (!manualMaterial.name || isNaN(emissionVal)) {
                  toast({ title: "Invalid input", description: "Enter a name and a valid emission factor." });
                  return;
                }
                setSelectedMaterials((prev) => [
                  ...prev,
                  { name: manualMaterial.name, emission: emissionVal, unit: manualMaterial.unit },
                ]);
                toast({ title: "Material added", description: `${manualMaterial.name} added to project.` });
                setManualMaterial({ name: "", emission: "", unit: manualMaterial.unit });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Material
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      {selectedMaterials.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-foreground mb-2">Selected Materials</h4>
          <div className="space-y-2">
            {selectedMaterials.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.emission} {m.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
