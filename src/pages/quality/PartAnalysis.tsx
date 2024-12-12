import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, RotateCcw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PartAnalysisForm } from "@/components/quality/PartAnalysisForm";
import { AnalysisContent } from "@/components/process/AnalysisContent";
import { PartAnalysisFeedback } from "@/components/quality/PartAnalysisFeedback";

const PartAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [predictedPartName, setPredictedPartName] = useState<string | null>(null);
  const [predictedMaterial, setPredictedMaterial] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartNew = () => {
    setAnalysis(null);
    setInspectionId(null);
    setPredictedPartName(null);
    setPredictedMaterial(null);
    toast({
      title: "Reset Complete",
      description: "You can now start a new part analysis.",
    });
  };

  const handleAnalysisComplete = (analysisResult: any, id: string, partName: string | null, material: string | null) => {
    setAnalysis(analysisResult);
    setInspectionId(id);
    setPredictedPartName(partName);
    setPredictedMaterial(material);
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
          <PartAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
        </Card>

        <div className="space-y-6">
          <AnalysisContent analysis={analysis} />
          {inspectionId && (
            <PartAnalysisFeedback 
              inspectionId={inspectionId}
              predictedPartName={predictedPartName || undefined}
              predictedMaterial={predictedMaterial || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PartAnalysis;