import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { AnalysisTypeSelect } from "./analysis/AnalysisTypeSelect";
import { AnalyzeButton } from "./analysis/AnalyzeButton";

interface PartAnalysisFormProps {
  onAnalysisComplete: (analysis: any, inspectionId: string, partName: string | null, material: string | null) => void;
}

export const PartAnalysisForm = ({ onAnalysisComplete }: PartAnalysisFormProps) => {
  const { session } = useSessionContext();
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [selectedInspectionType, setSelectedInspectionType] = useState<string>("");
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
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to perform analysis.",
        variant: "destructive"
      });
      return;
    }

    if (!image || !selectedInspectionType) {
      toast({
        title: "Missing information",
        description: "Please select an inspection type and upload an image",
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
      const formData = new FormData();
      formData.append('image', image);
      if (selectedWorkcenter) {
        formData.append('workcenter', selectedWorkcenter);
      }
      formData.append('inspectionTypeId', selectedInspectionType);
      formData.append('selectedArea', JSON.stringify(selectedArea));

      const { data: { data, error } } = await supabase.functions.invoke('analyze-process', {
        body: formData
      });

      if (error) throw error;

      const { data: inspectionData, error: insertError } = await supabase
        .from('part_inspections')
        .insert({
          workcenter_id: selectedWorkcenter || null,
          analysis_type_id: selectedInspectionType,
          image_url: imagePreview,
          analysis: JSON.stringify(data.analysis),
          predicted_part_name: data.partName || null,
          predicted_material: data.material || null,
          created_by: session.user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onAnalysisComplete(
        data.analysis, 
        inspectionData.id,
        data.partName || null,
        data.material || null
      );
      
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

      <AnalysisTypeSelect
        value={selectedInspectionType}
        onChange={setSelectedInspectionType}
      />

      <ProcessImageUploader
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
        onAreaSelect={setSelectedArea}
        selectedArea={selectedArea}
      />

      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={!selectedInspectionType || !image || isAnalyzing || !selectedArea}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};