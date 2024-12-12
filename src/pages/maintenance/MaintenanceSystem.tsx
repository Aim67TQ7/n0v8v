import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

const MaintenanceSystem = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
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
          companyId: profile.company_id
        }
      });

      if (error) throw error;

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
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Wrench className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Maintenance System</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">Equipment Analysis</h2>
            <p className="text-muted-foreground mb-4">
              Upload a photo of your equipment to automatically generate a maintenance schedule.
            </p>
            <ProcessImageUploader
              imagePreview={imagePreview}
              onImageUpload={handleImageUpload}
              onAreaSelect={handleAreaSelect}
              selectedArea={selectedArea}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MaintenanceSystem;