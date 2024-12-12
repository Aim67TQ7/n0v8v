import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";

interface PartAnalysisFormProps {
  onAnalysisComplete: (analysis: any) => void;
}

export const PartAnalysisForm = ({ onAnalysisComplete }: PartAnalysisFormProps) => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSelectedArea(null);
  };

  const handleAnalyze = async () => {
    if (!selectedWorkcenter || !image || !selectedAnalysisType) {
      toast({
        title: "Missing information",
        description: "Please select a workcenter, analysis type, and upload an image",
        variant: "destructive"
      });
      return;
    }

    if (!selectedArea) {
      toast({
        title: "Area not selected",
        description: "Please select the specific area to analyze by dragging on the image",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);

      // First upload the image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('process-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('process-images')
        .getPublicUrl(fileName);

      // Prepare form data for analysis
      const formData = new FormData();
      formData.append('image', image);
      formData.append('workcenter', selectedWorkcenter);
      formData.append('analysisTypeId', selectedAnalysisType);
      formData.append('selectedArea', JSON.stringify(selectedArea));

      // Call the analyze-process function
      const { data: { data: analysisData }, error: analysisError } = await supabase.functions
        .invoke('analyze-process', {
          body: formData
        });

      if (analysisError) throw analysisError;

      // Create the part inspection record
      const { data: partInspection, error: dbError } = await supabase
        .from('part_inspections')
        .insert({
          workcenter_id: selectedWorkcenter,
          analysis_type_id: selectedAnalysisType,
          image_url: publicUrl,
          analysis: analysisData.analysis.details
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onAnalysisComplete({
        ...analysisData.analysis,
        partInspectionId: partInspection.id,
        analysisTypeId: selectedAnalysisType
      });
      
      toast({
        title: "Analysis Complete",
        description: "Part analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the part. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <WorkcenterSelect 
        value={selectedWorkcenter} 
        onChange={setSelectedWorkcenter} 
      />

      <ProcessImageUploader
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
        onAreaSelect={setSelectedArea}
        selectedArea={selectedArea}
      />

      <Button
        onClick={handleAnalyze}
        disabled={!selectedWorkcenter || !image || isAnalyzing || !selectedArea}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Part...
          </>
        ) : (
          'Analyze Part'
        )}
      </Button>
    </div>
  );
};