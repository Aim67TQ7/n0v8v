import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface InspectionType {
  id: string;
  name: string;
  description: string;
}

interface PartAnalysisFormProps {
  onAnalysisComplete: (analysis: any) => void;
}

export const PartAnalysisForm = ({ onAnalysisComplete }: PartAnalysisFormProps) => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [selectedInspectionType, setSelectedInspectionType] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const { toast } = useToast();

  const { data: inspectionTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['inspectionTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspection_types')
        .select('id, name, description')
        .order('name');
      
      if (error) throw error;
      return data as InspectionType[];
    }
  });

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSelectedArea(null);
  };

  const handleAnalyze = async () => {
    if (!selectedInspectionType) {
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
      formData.append('image', image!);
      if (selectedWorkcenter) {
        formData.append('workcenter', selectedWorkcenter);
      }
      formData.append('inspectionTypeId', selectedInspectionType);
      formData.append('selectedArea', JSON.stringify(selectedArea));

      const { data: { data, error } } = await supabase.functions.invoke('analyze-process', {
        body: formData
      });

      if (error) throw error;

      // Save the process improvement record without specifying an ID
      const { data: processImprovement, error: dbError } = await supabase
        .from('process_improvements')
        .insert({
          workcenter_id: selectedWorkcenter || null,
          image_url: data.imageUrl,
          analysis: data.analysis.details
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onAnalysisComplete({
        ...data.analysis,
        processImprovementId: processImprovement.id,
        inspectionTypeId: selectedInspectionType
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Inspection Type</label>
        <Select 
          value={selectedInspectionType} 
          onValueChange={setSelectedInspectionType}
          disabled={isLoadingTypes}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose inspection type" />
          </SelectTrigger>
          <SelectContent>
            {inspectionTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
                {type.description && (
                  <span className="text-xs text-muted-foreground ml-2">
                    - {type.description}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProcessImageUploader
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
        onAreaSelect={setSelectedArea}
        selectedArea={selectedArea}
      />

      <Button
        onClick={handleAnalyze}
        disabled={!selectedInspectionType || !image || isAnalyzing || !selectedArea}
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