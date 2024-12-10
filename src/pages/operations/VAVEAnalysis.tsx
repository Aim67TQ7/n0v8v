import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { VAVEHeader } from "@/components/vave/VAVEHeader";
import { VAVEInstructions } from "@/components/vave/VAVEInstructions";
import { VAVEForm } from "@/components/vave/VAVEForm";
import { ProcessAnalysisResults } from "@/components/ProcessAnalysisResults";

const VAVEAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
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

        <ProcessAnalysisResults analysis={analysis} />
      </div>
    </div>
  );
};

export default VAVEAnalysis;