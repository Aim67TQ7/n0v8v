import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { GitFork } from "lucide-react";
import { useLocation } from "react-router-dom";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { CausesList } from "@/components/five-whys/CausesList";
import { FishboneResult } from "@/components/five-whys/FishboneResult";
import { useFiveWhys } from "@/hooks/use-five-whys";

const FiveWhys = () => {
  const location = useLocation();
  const {
    problemStatement,
    currentIteration,
    causes,
    isAnalyzing,
    analysis,
    startAnalysis,
    handleCauseToggle,
    handleNext,
    resetAnalysis,
  } = useFiveWhys();

  // Handle incoming problem statement from navigation
  useEffect(() => {
    const state = location.state as { problemStatement?: string };
    if (state?.problemStatement) {
      startAnalysis(state.problemStatement);
    }
  }, [location.state, startAnalysis]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <GitFork className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Five Whys Analysis</h1>
      </div>
      
      <Card className="p-6">
        {currentIteration === 0 ? (
          <FiveWhysForm onSubmit={startAnalysis} />
        ) : !analysis ? (
          <CausesList
            causes={causes}
            onCauseToggle={handleCauseToggle}
            currentIteration={currentIteration}
            isAnalyzing={isAnalyzing}
            onNext={handleNext}
            onReset={resetAnalysis}
          />
        ) : (
          <FishboneResult
            analysis={analysis}
            onReset={resetAnalysis}
          />
        )}
      </Card>
    </div>
  );
};

export default FiveWhys;