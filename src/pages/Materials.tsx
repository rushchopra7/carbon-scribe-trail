import { MaterialSearch } from "@/components/MaterialSearch";
import { TransportCalculator } from "@/components/TransportCalculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Materials = () => {
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Material & Transport Entry</h2>
          <p className="text-muted-foreground">Add materials and calculate transportation impact</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaterialSearch />
          <TransportCalculator />
        </div>
      </div>
    </div>
  );
};

export default Materials;
