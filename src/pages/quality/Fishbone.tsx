import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FishboneHeader } from "@/components/fishbone/FishboneHeader";
import { StepAnalysis } from "@/components/fishbone/StepAnalysis";
import { FishboneResults } from "@/components/fishbone/FishboneResults";
import type { FishboneState } from "@/types/fishbone";

const transformAnalysisToResults = (analysis: FishboneState) => {
  // Group causes by category
  const categories = analysis.steps.map(step => ({
    name: step.category,
    primaryCauses: step.causes
      .filter(cause => cause.checked)
      .map(cause => ({
        cause: cause.text,
        impact: "High" as const,
        secondaryCauses: analysis.round === 2 ? 
          analysis.steps
            .find(s => s.category === step.category)
            ?.causes
            .filter(c => c.checked)
            .map(c => ({
              cause: c.text,
              tertiaryCauses: [],
              evidence: "Based on detailed analysis"
            })) ?? []
          : []
      }))
  }));

  // Generate summary based on selected causes
  const allSelectedCauses = analysis.steps.flatMap(step => 
    step.causes.filter(cause => cause.checked).map(cause => cause.text)
  );

  return {
    categories,
    summary: {
      criticalCauses: allSelectedCauses.slice(0, 3),
      patterns: [
        "Multiple causes related to training and procedures",
        "Equipment maintenance issues recurring",
        "Environmental factors significantly impact quality"
      ],
      recommendations: [
        "Implement standardized training program",
        "Establish regular equipment maintenance schedule",
        "Review and update quality control procedures"
      ],
      dataGaps: [
        "Historical maintenance records",
        "Training completion rates",
        "Quality metrics over time"
      ]
    }
  };
};

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
          analysis={transformAnalysisToResults(analysis)}
          onReset={resetAnalysis}
        />
      )}
    </div>
  );
};

export default Fishbone;