import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";
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

const MaintenanceSystem = () => {
  const [images, setImages] = useState<File[]>([]);
  const [equipmentDetails, setEquipmentDetails] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { session } = useSessionContext();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!images.length || !session?.user) {
      toast({
        title: "Error",
        description: "Please upload at least one image and provide equipment details",
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

      // Upload images to storage
      const imageUrls = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('process-images')
          .upload(fileName, image);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('process-images')
          .getPublicUrl(fileName);
          
        imageUrls.push(publicUrl);
      }
      
      setProgress(60);

      // Convert images to base64
      const base64Images = await Promise.all(
        imageUrls.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              resolve(base64String.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
      );

      setProgress(80);

      const { data, error } = await supabase.functions.invoke('analyze-maintenance', {
        body: { 
          imageData: base64Images,
          companyId: profile.company_id,
          equipmentDetails: equipmentDetails
        }
      });

      if (error) throw error;

      setProgress(100);
      
      toast({
        title: "Analysis Complete",
        description: "Equipment has been analyzed and maintenance schedule created"
      });

      setImages([]);
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
                      placeholder="Please provide detailed information about the equipment:
• Make and model
• Serial number (if visible)
• Equipment type/category
• Current condition or concerns
• Any specific maintenance requirements
• Operating environment
• Age or installation date (if known)
• Previous maintenance history (if available)"
                      className="min-h-[200px]"
                    />
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  Upload photos of your equipment (up to 4) to generate a suggested maintenance schedule.
                  Supported formats: JPG, PNG, WebP
                </p>
                
                <FiveSVisionImageUploader 
                  images={images} 
                  setImages={setImages} 
                />

                {images.length > 0 && (
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