import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FishboneHeader } from "@/components/fishbone/FishboneHeader";
import { StepAnalysis } from "@/components/fishbone/StepAnalysis";
import { FishboneResults } from "@/components/fishbone/FishboneResults";
import type { FishboneState } from "@/types/fishbone";

const Fishbone = () => {
  const [analysis, setAnalysis] = useState<FishboneState | null>(null);

  const handleAnalysisComplete = (completedAnalysis: FishboneState) => {
    setAnalysis(completedAnalysis);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FishboneHeader />
      {!analysis ? (
        <StepAnalysis onComplete={handleAnalysisComplete} />
      ) : (
        <FishboneResults
          analysis={analysis}
          onReset={resetAnalysis}
        />
      )}
    </div>
  );
};

export default Fishbone;