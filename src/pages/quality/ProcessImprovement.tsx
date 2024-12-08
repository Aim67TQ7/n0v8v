import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, Upload, Camera, Loader2, AlertCircle } from "lucide-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageSelector } from "@/components/ImageSelector";

const ProcessImprovement = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysis("");
      setSelectedArea(null);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      document.getElementById('image-upload')?.click();
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Microscope className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Process Improvement</h1>
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

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCameraCapture}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
            />

            {imagePreview && (
              <div className="relative">
                <ImageSelector
                  imageUrl={imagePreview}
                  onAreaSelect={setSelectedArea}
                  selectedArea={selectedArea}
                />
              </div>
            )}

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

        {analysis && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="prose prose-sm">
              {analysis.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProcessImprovement;