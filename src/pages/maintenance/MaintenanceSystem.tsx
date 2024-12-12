import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { EquipmentList } from "@/components/maintenance/EquipmentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const MaintenanceSystem = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [equipmentDetails, setEquipmentDetails] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { session } = useSessionContext();
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAreaSelect = (area: { x: number; y: number; width: number; height: number } | null) => {
    setSelectedArea(area);
  };

  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Remove data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAnalyze = async () => {
    if (!imagePreview || !selectedArea || !session?.user) {
      toast({
        title: "Error",
        description: "Please upload an image and select an area to analyze",
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
        .eq('id', session.user.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('No company ID found');
      }

      setProgress(40);

      // Convert image to base64
      const base64Image = await convertImageToBase64(imagePreview);
      
      setProgress(60);

      // Process the image with AI
      const { data, error } = await supabase.functions.invoke('analyze-maintenance', {
        body: { 
          imageData: base64Image,
          selectedArea,
          companyId: profile.company_id,
          equipmentDetails: equipmentDetails
        }
      });

      setProgress(80);

      if (error) throw error;

      setProgress(100);
      
      toast({
        title: "Analysis Complete",
        description: "Equipment has been analyzed and maintenance schedule created"
      });

      // Reset the form
      setImagePreview("");
      setSelectedArea(null);
      setEquipmentDetails("");

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

      <Tabs defaultValue="analyze" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analyze">Analyze Equipment</TabsTrigger>
          <TabsTrigger value="schedules">Maintenance Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze">
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
                      placeholder="Enter any known details about the equipment (make, model, type, serial number, etc.)"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  Upload a photo of your equipment to generate a suggested maintenance schedule.
                </p>
                <ProcessImageUploader
                  imagePreview={imagePreview}
                  onImageUpload={handleImageUpload}
                  onAreaSelect={handleAreaSelect}
                  selectedArea={selectedArea}
                />
                {imagePreview && selectedArea && (
                  <div className="mt-4 space-y-4">
                    <Button 
                      onClick={handleAnalyze} 
                      className="w-full relative" 
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? "Analyzing Equipment..." : "Generate Maintenance Schedule"}
                    </Button>
                    {isAnalyzing && (
                      <Progress value={progress} className="w-full h-2" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <EquipmentList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceSystem;