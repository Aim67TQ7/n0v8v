import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wrench, Database, Calendar, CheckSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { EquipmentList } from "@/components/maintenance/EquipmentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FiveSVisionImageUploader } from "@/components/FiveSVisionImageUploader";
import { EquipmentAnalysisResults } from "@/components/maintenance/EquipmentAnalysisResults";

const MaintenanceSystem = () => {
  const [images, setImages] = useState<File[]>([]);
  const [equipmentDetails, setEquipmentDetails] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("analyze");
  const { session } = useSessionContext();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!images.length && !equipmentDetails) {
      toast({
        title: "Missing Information",
        description: "Please provide equipment details and/or upload images",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setProgress(20);

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('No company ID found');
      }

      setProgress(40);

      // Convert images to base64
      const base64Images = await Promise.all(
        images.map(async (image) => {
          const buffer = await image.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(buffer)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          return base64;
        })
      );

      setProgress(60);

      const { data, error } = await supabase.functions.invoke('analyze-maintenance', {
        body: { 
          imageData: base64Images,
          companyId: profile.company_id,
          equipmentDetails: equipmentDetails
        }
      });

      if (error) throw error;

      setProgress(100);
      setAnalysisResults(data);
      
      toast({
        title: "Analysis Complete",
        description: "Equipment has been analyzed and maintenance schedule created"
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the equipment",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Wrench className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Maintenance System</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="analyze">Analyze Equipment</TabsTrigger>
          <TabsTrigger value="schedules">Maintenance Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-semibold mb-4">Equipment Analysis</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipment Details</Label>
                      <Textarea
                        id="equipment"
                        value={equipmentDetails}
                        onChange={(e) => setEquipmentDetails(e.target.value)}
                        placeholder="Please provide as much detail as possible about the equipment:

• Make and model number
• Serial number
• Equipment type/category
• Year of manufacture (if known)
• Current operating condition
• Any specific maintenance concerns
• Operating environment details
• Power requirements
• Physical dimensions
• Safety features
• Known maintenance history
• Warranty information (if available)
• Any modifications or upgrades
• Operating hours/usage frequency
• Location/department where equipment is used
• Critical components or parts
• Any recurring issues or patterns
• Special maintenance requirements
• Calibration needs (if applicable)
• Compliance requirements"
                        className="min-h-[300px]"
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    Upload photos of your equipment (up to 4) to help identify manuals and maintenance requirements.
                    Photos of equipment tags, model numbers, and overall condition are most helpful.
                    Supported formats: JPG, PNG, WebP
                  </p>
                  
                  <FiveSVisionImageUploader 
                    images={images} 
                    setImages={setImages} 
                  />

                  {(images.length > 0 || equipmentDetails) && (
                    <div className="mt-4 space-y-4">
                      <Button 
                        onClick={handleAnalyze} 
                        className="w-full relative" 
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? "Analyzing Equipment..." : "Submit"}
                      </Button>
                      {isAnalyzing && (
                        <Progress value={progress} className="w-full h-2" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <EquipmentAnalysisResults 
              results={analysisResults} 
              onViewSchedule={() => setActiveTab("schedules")}
            />
          </div>
        </TabsContent>

        <TabsContent value="schedules">
          <EquipmentList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceSystem;