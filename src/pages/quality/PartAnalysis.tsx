import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PartAnalysisHeader } from "@/components/part-analysis/PartAnalysisHeader";
import { PartAnalysisInstructions } from "@/components/part-analysis/PartAnalysisInstructions";
import { PartAnalysisLayout } from "@/components/part-analysis/PartAnalysisLayout";
import { AuthDebug } from "@/components/auth/AuthDebug";

const PartAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const handleStartNew = () => {
    setAnalysis(null);
    toast({
      title: "Reset Complete",
      description: "You can now start a new part analysis.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AuthDebug />
      <PartAnalysisHeader onStartNew={handleStartNew} />
      <PartAnalysisInstructions />
      <PartAnalysisLayout 
        analysis={analysis}
        onAnalysisComplete={setAnalysis}
      />
    </div>
  );
};

export default PartAnalysis;