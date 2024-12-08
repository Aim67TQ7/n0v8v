import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { FiveSVisionImageUploader } from "@/components/FiveSVisionImageUploader";
import { useToast } from "@/hooks/use-toast";
import { uploadImages, analyzeImages, createEvaluation, saveImageReferences } from "@/services/fiveSEvaluationService";

interface FiveSEvaluationFormProps {
  onEvaluationComplete: (evaluationId: string) => void;
}

export const FiveSEvaluationForm = ({ onEvaluationComplete }: FiveSEvaluationFormProps) => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedWorkcenter || images.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a workcenter and upload images",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      toast({
        title: "Analysis in Progress",
        description: "The AI is analyzing your images. This may take up to 60 seconds...",
      });
      
      const imageUrls = await uploadImages(images);
      const analysis = await analyzeImages(imageUrls);
      const evaluation = await createEvaluation(selectedWorkcenter, analysis);
      await saveImageReferences(evaluation.id, imageUrls);
      
      onEvaluationComplete(evaluation.id);
      toast({
        title: "Success",
        description: "5S evaluation completed successfully",
      });
      
      setImages([]);
      setSelectedWorkcenter("");
    } catch (error) {
      console.error('Error during evaluation:', error);
      toast({
        title: "Error",
        description: "Failed to complete 5S evaluation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <WorkcenterSelect 
          value={selectedWorkcenter} 
          onChange={setSelectedWorkcenter} 
        />

        <FiveSVisionImageUploader 
          images={images} 
          setImages={setImages} 
        />

        <Button
          onClick={handleSubmit}
          disabled={!selectedWorkcenter || images.length === 0 || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Images (This may take up to 60 seconds)...
            </>
          ) : (
            'Submit Evaluation'
          )}
        </Button>
      </div>
    </Card>
  );
};