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

const MaintenanceSystem = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [equipmentDetails, setEquipmentDetails] = useState("");
  const { session } = useSessionContext();
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAreaSelect = (area: { x: number; y: number; width: number; height: number } | null) => {
    setSelectedArea(area);
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('No company ID found');
      }

      // Upload image to storage
      const fileExt = imagePreview.split(';')[0].split('/')[1];
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('process-images')
        .upload(filePath, imagePreview);

      if (uploadError) throw uploadError;

      // Process the image with AI
      const { data, error } = await supabase.functions.invoke('analyze-maintenance', {
        body: { 
          imageUrl: filePath,
          selectedArea,
          companyId: profile.company_id,
          equipmentDetails: equipmentDetails
        }
      });

      if (error) throw error;

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
                  <div className="mt-4">
                    <Button onClick={handleAnalyze} className="w-full">
                      Generate Maintenance Schedule
                    </Button>
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