import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { ProcessAnalysisResults } from "@/components/ProcessAnalysisResults";

const ProcessImprovement = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysis("");
    setSelectedArea(null);
  };

  const handleAnalyze = async () => {
    if (!selectedWorkcenter || !image) {
      toast({
        title: "Missing information",
        description: "Please select a workcenter and upload an image",
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
      formData.append('workcenter', selectedWorkcenter);
      formData.append('selectedArea', JSON.stringify(selectedArea));

      const { data: { data, error } } = await supabase.functions.invoke('analyze-process', {
        body: formData
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Process analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartNew = () => {
    setSelectedWorkcenter("");
    setImage(null);
    setImagePreview("");
    setAnalysis("");
    setSelectedArea(null);
    setIsAnalyzing(false);
    toast({
      title: "Reset Complete",
      description: "You can now start a new part analysis.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Microscope className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Process Improvement</h1>
        </div>
        <Button
          onClick={handleStartNew}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Part Analysis
        </Button>
      </div>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          For best results, ensure your photo:
          <ul className="list-disc ml-6 mt-2">
            <li>Shows only the specific part or area to be analyzed</li>
            <li>Is well-lit and in focus</li>
            <li>Has minimal background clutter</li>
            <li>After uploading, select the specific area to analyze by dragging on the image</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
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
                  Analyzing Process...
                </>
              ) : (
                'Analyze Process'
              )}
            </Button>
          </div>
        </Card>

        <ProcessAnalysisResults analysis={analysis} />
      </div>
    </div>
  );
};

export default ProcessImprovement;