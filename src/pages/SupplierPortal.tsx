import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SupplierPortal = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setUploadedFiles([...uploadedFiles, fileName]);
      toast({
        title: "EPD Uploaded Successfully",
        description: `${fileName} has been verified and added to the system.`,
      });
    }
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

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Supplier Portal</h2>
          <p className="text-muted-foreground">Upload Environmental Product Declarations (EPDs)</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upload EPD Document</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier-name">Supplier Name</Label>
                <Input id="supplier-name" placeholder="Your company name" />
              </div>

              <div>
                <Label htmlFor="material-name">Material Name</Label>
                <Input id="material-name" placeholder="Product or material name" />
              </div>

              <div>
                <Label htmlFor="epd-file">EPD Document (PDF)</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="epd-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Only verified EPDs from recognized certification bodies are accepted
                </p>
              </div>
            </div>
          </Card>

          {uploadedFiles.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Uploaded Documents</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg"
                  >
                    <FileCheck className="h-5 w-5 text-success" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{file}</p>
                      <p className="text-xs text-muted-foreground">Verified and active</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-2">Why Upload EPDs?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Increase transparency and trust with construction companies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Showcase your commitment to environmental responsibility</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Enable accurate carbon footprint tracking for your customers</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;
