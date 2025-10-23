import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  location: string;
  carbon: number;
  trend: number;
  status: "active" | "completed" | "planning";
  materials: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Riverside Tower",
    location: "Berlin, Germany",
    carbon: 24567,
    trend: -12,
    status: "active",
    materials: 156
  },
  {
    id: "2",
    name: "Green Campus",
    location: "Munich, Germany",
    carbon: 18234,
    trend: -8,
    status: "active",
    materials: 98
  },
  {
    id: "3",
    name: "Solar District",
    location: "Hamburg, Germany",
    carbon: 31245,
    trend: 5,
    status: "planning",
    materials: 42
  }
];

const Projects = () => {
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Project Portfolio</h2>
          <p className="text-muted-foreground">Manage and compare carbon footprints across projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                </div>
                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Carbon</p>
                  <p className="text-xl font-bold text-foreground">{project.carbon.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">kg CO₂e</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Materials</p>
                  <p className="text-xl font-bold text-foreground">{project.materials}</p>
                  <p className="text-xs text-muted-foreground">tracked items</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  project.trend > 0 ? "text-destructive" : "text-success"
                }`}>
                  {project.trend > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(project.trend)}% vs target</span>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
