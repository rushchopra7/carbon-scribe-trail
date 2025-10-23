import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Truck, Calculator } from "lucide-react";

export const TransportCalculator = () => {
  const [distance, setDistance] = useState("");
  const [vehicle, setVehicle] = useState("truck");
  const [result, setResult] = useState<number | null>(null);

  const calculateEmissions = () => {
    const emissionFactors: Record<string, number> = {
      truck: 0.062,
      train: 0.022,
      ship: 0.014,
      plane: 0.5
    };
    
    const emissions = parseFloat(distance) * emissionFactors[vehicle];
    setResult(emissions);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Transportation Impact</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="distance">Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            placeholder="Enter distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="vehicle">Vehicle Type</Label>
          <Select value={vehicle} onValueChange={setVehicle}>
            <SelectTrigger id="vehicle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="truck">Heavy Truck (0.062 kg CO₂e/km)</SelectItem>
              <SelectItem value="train">Freight Train (0.022 kg CO₂e/km)</SelectItem>
              <SelectItem value="ship">Cargo Ship (0.014 kg CO₂e/km)</SelectItem>
              <SelectItem value="plane">Air Freight (0.5 kg CO₂e/km)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={calculateEmissions} className="w-full gap-2">
          <Calculator className="h-4 w-4" />
          Calculate Emissions
        </Button>
        
        {result !== null && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Estimated Transport Emissions</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {result.toFixed(2)} kg CO₂e
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
