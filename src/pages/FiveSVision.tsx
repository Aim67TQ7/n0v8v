import { FiveSEvaluationForm } from "@/components/FiveSEvaluationForm";
import { FiveSEvaluationResults } from "@/components/FiveSEvaluationResults";
import { useState } from "react";

const FiveSVision = () => {
  const [evaluationId, setEvaluationId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleEvaluationComplete = (id: string) => {
    setEvaluationId(id);
  };

  const handleNewEvaluation = () => {
    setEvaluationId(undefined);
  };

  return (
    <div className="container mx-auto py-8">
      {!evaluationId ? (
        <FiveSEvaluationForm onEvaluationComplete={handleEvaluationComplete} />
      ) : (
        <FiveSEvaluationResults
          evaluation={evaluationId}
          onNewEvaluation={handleNewEvaluation}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default FiveSVision;