import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Microscope, Loader2, AlertCircle } from "lucide-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { ProcessAnalysisResults } from "@/components/ProcessAnalysisResults";

const VAVEAnalysis = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const { toast } = useToast();

  // Value Analysis checkboxes
  const [valueChecks, setValueChecks] = useState({
    functionalImprovements: false,
    manufacturingOptimization: false,
    assemblyErgonomics: false,
    designOptimization: false,
    materialOptimization: false,
  });

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysis(null);
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

    // Check if at least one value analysis category is selected
    if (!Object.values(valueChecks).some(Boolean)) {
      toast({
        title: "Value Analysis Required",
        description: "Please select at least one value analysis category",
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
      formData.append('valueChecks', JSON.stringify(valueChecks));

      const { data: { data, error } } = await supabase.functions.invoke('analyze-vave', {
        body: formData
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      
      toast({
        title: "Analysis Complete",
        description: "VAVE analysis has been completed successfully.",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Microscope className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">VAVE Analysis</h1>
        </div>
      </div>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          For best results, ensure your photo:
          <ul className="list-disc ml-6 mt-2">
            <li>Shows the specific part or assembly to be analyzed</li>
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

            <div className="space-y-4">
              <h3 className="font-medium">Value Analysis Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="functional" 
                    checked={valueChecks.functionalImprovements}
                    onCheckedChange={(checked) => 
                      setValueChecks(prev => ({ ...prev, functionalImprovements: checked as boolean }))
                    }
                  />
                  <label htmlFor="functional" className="text-sm">
                    Functional Improvements
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="manufacturing" 
                    checked={valueChecks.manufacturingOptimization}
                    onCheckedChange={(checked) => 
                      setValueChecks(prev => ({ ...prev, manufacturingOptimization: checked as boolean }))
                    }
                  />
                  <label htmlFor="manufacturing" className="text-sm">
                    Manufacturing Process Optimization
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="assembly" 
                    checked={valueChecks.assemblyErgonomics}
                    onCheckedChange={(checked) => 
                      setValueChecks(prev => ({ ...prev, assemblyErgonomics: checked as boolean }))
                    }
                  />
                  <label htmlFor="assembly" className="text-sm">
                    Assembly and Ergonomics
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="design" 
                    checked={valueChecks.designOptimization}
                    onCheckedChange={(checked) => 
                      setValueChecks(prev => ({ ...prev, designOptimization: checked as boolean }))
                    }
                  />
                  <label htmlFor="design" className="text-sm">
                    Design Optimization and Standardization
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="material" 
                    checked={valueChecks.materialOptimization}
                    onCheckedChange={(checked) => 
                      setValueChecks(prev => ({ ...prev, materialOptimization: checked as boolean }))
                    }
                  />
                  <label htmlFor="material" className="text-sm">
                    Material and Thickness Optimization
                  </label>
                </div>
              </div>
            </div>

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

export default VAVEAnalysis;