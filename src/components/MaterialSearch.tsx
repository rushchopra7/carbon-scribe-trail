import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

export const MaterialSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [manualMaterial, setManualMaterial] = useState({
    name: "",
    emission: "",
    unit: "kg CO₂e/kg"
  });

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
            {["Concrete C30/37", "Steel Rebar", "Timber Beam", "Ceramic Brick"].map((material) => (
              <div
                key={material}
                className="p-3 border rounded-lg hover:bg-secondary cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{material}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 300 + 50)} kg CO₂e/ton
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
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
            
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Material
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
