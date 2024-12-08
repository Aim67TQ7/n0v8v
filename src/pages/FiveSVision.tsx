import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { FiveSVisionImageUploader } from "@/components/FiveSVisionImageUploader";
import { uploadImages, analyzeImages, createEvaluation, saveImageReferences } from "@/services/fiveSEvaluationService";

const FiveSVision = () => {
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
      console.log('Starting image upload...');
      
      const imageUrls = await uploadImages(images);
      console.log('Images uploaded:', imageUrls);
      
      const analysis = await analyzeImages(imageUrls);
      console.log('Analysis received:', analysis);
      
      const evaluation = await createEvaluation(selectedWorkcenter, analysis);
      console.log('Evaluation created:', evaluation);
      
      await saveImageReferences(evaluation.id, imageUrls);
      
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
        description: "Failed to complete 5S evaluation",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">5S Vision Evaluation</h1>
      </div>

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
                Analyzing...
              </>
            ) : (
              'Submit Evaluation'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FiveSVision;