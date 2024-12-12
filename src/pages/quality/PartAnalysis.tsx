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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const PartAnalysis = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [selectedInspectionType, setSelectedInspectionType] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const { toast } = useToast();

  const { data: inspectionTypes } = useQuery({
    queryKey: ['inspectionTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspection_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysis("");
    setSelectedArea(null);
  };

  const handleAnalyze = async () => {
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

      setAnalysis(data.analysis);
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

  const handleStartNew = () => {
    setSelectedWorkcenter("");
    setSelectedInspectionType("");
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
          <h1 className="text-3xl font-bold">Part Analysis</h1>
        </div>
        <Button
          onClick={handleStartNew}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Analysis
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Inspection Type</label>
              <Select value={selectedInspectionType} onValueChange={setSelectedInspectionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose inspection type" />
                </SelectTrigger>
                <SelectContent>
                  {inspectionTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
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
        </Card>

        <ProcessAnalysisResults analysis={analysis} />
      </div>
    </div>
  );
};

export default PartAnalysis;