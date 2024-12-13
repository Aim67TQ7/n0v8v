import { FiveSEvaluationForm } from "@/components/FiveSEvaluationForm";
import { FiveSEvaluationResults } from "@/components/FiveSEvaluationResults";
import { useState } from "react";
import { AuthWrapper } from "@/components/AuthWrapper";

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
    <AuthWrapper>
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
    </AuthWrapper>
  );
};

export default FiveSVision;