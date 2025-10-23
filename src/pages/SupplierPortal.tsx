import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileCheck, CheckCircle2, FileText, Trash2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type DocumentType = "lieferschein" | "epd" | "invoice" | "certificate" | "other";

interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: Date;
  supplierName?: string;
  materialName?: string;
  extractedData?: {
    carbonFootprint?: number; // kg CO₂e
    weight?: number; // kg
    quantity?: number; // units/pieces
    origin?: string;
  };
}

interface CompanySummary {
  company: string;
  totalWeight: number;
  totalCarbonFootprint: number;
  documentCount: number;
  totalQuantity: number;
}

const SupplierPortal = () => {
  const { toast } = useToast();
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [documentType, setDocumentType] = useState<DocumentType>("lieferschein");
  const [supplierName, setSupplierName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate company summaries whenever documents change
  const companySummaries = uploadedDocuments.reduce((acc, doc) => {
    const company = doc.supplierName || "Unknown Company";
    const existing = acc.find(s => s.company === company);
    
    const weight = doc.extractedData?.weight || 0;
    const carbon = doc.extractedData?.carbonFootprint || 0;
    const quantity = doc.extractedData?.quantity || 0;
    
    if (existing) {
      existing.totalWeight += weight;
      existing.totalCarbonFootprint += carbon;
      existing.totalQuantity += quantity;
      existing.documentCount += 1;
    } else {
      acc.push({
        company,
        totalWeight: weight,
        totalCarbonFootprint: carbon,
        totalQuantity: quantity,
        documentCount: 1,
      });
    }
    return acc;
  }, [] as CompanySummary[]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocuments: UploadedDocument[] = [];
      
      // Process all selected files
      Array.from(files).forEach((file) => {
        // Simulate document processing with extracted data in kg units
        const mockExtractedData = {
          carbonFootprint: documentType === "lieferschein" ? Math.random() * 500 + 100 : undefined,
          weight: Math.random() * 1000 + 100, // Always in kg
          origin: documentType === "lieferschein" ? "Germany" : undefined,
          quantity: documentType === "lieferschein" ? Math.floor(Math.random() * 50 + 5) : undefined,
        };

        const newDocument: UploadedDocument = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          type: documentType,
          uploadedAt: new Date(),
          supplierName: supplierName || undefined,
          materialName: materialName || undefined,
          extractedData: mockExtractedData,
        };
        
        newDocuments.push(newDocument);
      });

      setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
      
      toast({
        title: "Documents Uploaded Successfully",
        description: `${newDocuments.length} document${newDocuments.length > 1 ? 's' : ''} processed and verified.`,
      });

      // Reset form
      e.target.value = "";
    }
  };

  const handleDeleteDocument = (id: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.id !== id));
    toast({
      title: "Document Removed",
      description: "Document has been removed from the system.",
    });
  };

  const getDocumentTypeLabel = (type: DocumentType) => {
    const labels: Record<DocumentType, string> = {
      lieferschein: "Lieferschein (Delivery Note)",
      epd: "EPD (Environmental Product Declaration)",
      invoice: "Invoice",
      certificate: "Certificate",
      other: "Other Document",
    };
    return labels[type];
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

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Document Upload Portal</h2>
          <p className="text-muted-foreground">Upload delivery notes, EPDs, invoices, and other documents</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="companies">
              By Company ({companySummaries.length})
            </TabsTrigger>
            <TabsTrigger value="results">
              Individual Results ({uploadedDocuments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upload Document</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
                    <SelectTrigger id="document-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lieferschein">Lieferschein (Delivery Note)</SelectItem>
                      <SelectItem value="epd">EPD (Environmental Product Declaration)</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="other">Other Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="supplier-name">Supplier Name</Label>
                  <Input 
                    id="supplier-name" 
                    placeholder="Your company name"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="material-name">Material/Product Name</Label>
                  <Input 
                    id="material-name" 
                    placeholder="Product or material name"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="document-file">Document Files (PDF, Excel, or Image)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      id="document-file"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      multiple
                      className="cursor-pointer"
                    />
                    <Button className="gap-2" type="button" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4" />
                      Choose Files
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select multiple files to upload (e.g., one for quantity, one for weight). All metrics in kg.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">Document Processing</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Automatic data extraction from delivery notes and invoices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Carbon footprint calculation based on document data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Individual verification and audit trail for each document</span>
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
                  Upload documents with supplier information to see company-wise summaries
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companySummaries.map((summary, index) => (
                  <Card key={index} className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-foreground">{summary.company}</h4>
                        <Badge variant="secondary">{summary.documentCount} docs</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-card/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Weight</p>
                          <p className="text-xl font-bold text-foreground">{summary.totalWeight.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">kg</p>
                        </div>
                        
                        <div className="p-3 bg-card/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Quantity</p>
                          <p className="text-xl font-bold text-foreground">{summary.totalQuantity}</p>
                          <p className="text-xs text-muted-foreground">units</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Total Carbon Footprint</p>
                        <p className="text-2xl font-bold text-primary">{summary.totalCarbonFootprint.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">kg CO₂e</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {uploadedDocuments.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload documents to see individual processing results
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {uploadedDocuments.map((doc) => (
                  <Card key={doc.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <FileCheck className="h-5 w-5 text-success mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {getDocumentTypeLabel(doc.type)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {doc.uploadedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                        <p className="text-sm font-medium text-foreground">
                          {doc.supplierName || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Material/Product</p>
                        <p className="text-sm font-medium text-foreground">
                          {doc.materialName || "Not specified"}
                        </p>
                      </div>
                      {doc.extractedData && (
                        <>
                          {doc.extractedData.quantity && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                              <p className="text-sm font-medium text-foreground">
                                {doc.extractedData.quantity} units
                              </p>
                            </div>
                          )}
                          {doc.extractedData.weight && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Weight</p>
                              <p className="text-sm font-medium text-foreground">
                                {doc.extractedData.weight.toFixed(2)} kg
                              </p>
                            </div>
                          )}
                          {doc.extractedData.carbonFootprint && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Carbon Footprint</p>
                              <p className="text-sm font-medium text-foreground">
                                {doc.extractedData.carbonFootprint.toFixed(2)} kg CO₂e
                              </p>
                            </div>
                          )}
                          {doc.extractedData.origin && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Origin</p>
                              <p className="text-sm font-medium text-foreground">
                                {doc.extractedData.origin}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">Verified and processed</span>
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
