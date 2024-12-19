import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StepHeader } from "./steps/StepHeader";
import { CausesList } from "./causes/CausesList";
import { StepNavigation } from "./steps/StepNavigation";
import { initialSteps, generateSecondRound } from "@/lib/five-whys/steps";
import type { FishboneState } from "@/types/fishbone";

interface StepAnalysisProps {
  onComplete: (analysis: FishboneState) => void;
}

export const StepAnalysis = ({ onComplete }: StepAnalysisProps) => {
  const [state, setState] = useState<FishboneState>({
    currentStep: 0,
    steps: initialSteps,
    selectedCauses: [],
    round: 1
  });

  const handleCauseToggle = (causeId: string, checked: boolean) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step => ({
        ...step,
        causes: step.causes.map(cause => 
          cause.id === causeId ? { ...cause, checked } : cause
        )
      }))
    }));
  };

  const handleNext = () => {
    if (state.currentStep < state.steps.length - 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    } else if (state.round === 1) {
      const selectedCauses = state.steps.flatMap(step => 
        step.causes.filter(cause => cause.checked)
      );
      
      setState(prev => ({
        ...prev,
        currentStep: 0,
        round: 2,
        selectedCauses,
        steps: generateSecondRound(selectedCauses)
      }));
    } else {
      onComplete(state);
    }
  };

  // Guard against invalid currentStep
  if (state.currentStep >= state.steps.length) {
    return null;
  }

  const currentStep = state.steps[state.currentStep];
  if (!currentStep) {
    return null;
  }

  return (
    <Card className="p-6">
      <StepHeader
        category={currentStep.category}
        title={currentStep.title}
        description={currentStep.description}
        round={state.round}
      />
      
      <CausesList
        causes={currentStep.causes}
        onCauseToggle={handleCauseToggle}
      />

      <StepNavigation
        currentStep={state.currentStep}
        totalSteps={state.steps.length}
        round={state.round}
        isAnalyzing={false}
        onNext={handleNext}
      />
    </Card>
  );
};