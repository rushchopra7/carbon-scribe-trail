import { CarbonMetricCard } from "@/components/CarbonMetricCard";
import { GamificationBadge } from "@/components/GamificationBadge";
import { DeliveryAlert } from "@/components/DeliveryAlert";
import { AuditTrail } from "@/components/AuditTrail";
import { Button } from "@/components/ui/button";
import { Leaf, Package, Truck, Building2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CarbonTrack</h1>
                <p className="text-sm text-muted-foreground">Construction Carbon Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/projects">
                <Button variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  All Projects
                </Button>
              </Link>
              <Link to="/materials">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Riverside Tower Project</h2>
          <p className="text-muted-foreground">Real-time carbon footprint tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CarbonMetricCard
            title="Total Carbon Footprint"
            value="24,567"
            unit="kg CO₂e"
            trend={-12}
            icon={<Leaf className="h-6 w-6" />}
            variant="success"
          />
          <CarbonMetricCard
            title="Materials Delivered"
            value="156"
            unit="items"
            trend={8}
            icon={<Package className="h-6 w-6" />}
            variant="default"
          />
          <CarbonMetricCard
            title="Transport Emissions"
            value="3,421"
            unit="kg CO₂e"
            trend={-5}
            icon={<Truck className="h-6 w-6" />}
            variant="success"
          />
          <CarbonMetricCard
            title="High-Carbon Alerts"
            value="7"
            unit="active"
            trend={15}
            icon={<Package className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <DeliveryAlert
              material="Standard Portland Cement"
              carbonImpact={850}
              alternative="Blended Cement (30% Fly Ash)"
              savings={35}
            />
            <DeliveryAlert
              material="Virgin Aluminum"
              carbonImpact={1240}
              alternative="Recycled Aluminum"
              savings={92}
            />
          </div>
          
          <GamificationBadge
            score={2847}
            streak={14}
            rank="Eco Champion"
            level={8}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AuditTrail />
          
          <div className="space-y-4">
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Project Benchmarks</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">vs Industry Average</span>
                    <span className="font-semibold text-success">-18%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[82%] bg-success rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">vs Best in Class</span>
                    <span className="font-semibold text-warning">+12%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[112%] bg-warning rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <Link to="/supplier-portal">
              <Button variant="outline" className="w-full">
                Access Supplier Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
