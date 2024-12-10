import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VAVEHeader } from "@/components/vave/VAVEHeader";
import { VAVEInstructions } from "@/components/vave/VAVEInstructions";
import { VAVEForm } from "@/components/vave/VAVEForm";
import { ProcessAnalysisResults } from "@/components/ProcessAnalysisResults";
import { SaveVAVEReportDialog } from "@/components/vave/SaveVAVEReportDialog";

const VAVEAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [currentWorkcenter, setCurrentWorkcenter] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const { toast } = useToast();

  const handleAnalyze = async ({
    selectedWorkcenter,
    image,
    selectedArea,
    valueChecks,
  }: {
    selectedWorkcenter: string;
    image: File;
    selectedArea: { x: number; y: number; width: number; height: number };
    valueChecks: {
      functionalImprovements: boolean;
      manufacturingOptimization: boolean;
      assemblyErgonomics: boolean;
      designOptimization: boolean;
      materialOptimization: boolean;
    };
  }) => {
    try {
      // Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('process-images')
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('process-images')
        .getPublicUrl(filePath);

      setCurrentImageUrl(publicUrl);
      setCurrentWorkcenter(selectedWorkcenter);

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
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <VAVEHeader />
      <VAVEInstructions />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <VAVEForm onAnalyze={handleAnalyze} />
        </Card>

        {analysis && (
          <div className="space-y-6">
            <ProcessAnalysisResults analysis={analysis} />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Skip
              </Button>
              <Button onClick={() => setShowSaveDialog(true)}>
                Save Report
              </Button>
            </div>
          </div>
        )}
      </div>

      <SaveVAVEReportDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        workcenter={currentWorkcenter}
        imageUrl={currentImageUrl}
        analysis={analysis}
      />
    </div>
  );
};

export default VAVEAnalysis;