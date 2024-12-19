import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  round: 1 | 2;
  isAnalyzing: boolean;
  onNext: () => void;
}

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  round, 
  isAnalyzing, 
  onNext 
}: StepNavigationProps) => {
  return (
    <div className="mt-6 flex justify-end space-x-4">
      <Button
        onClick={onNext}
        className="relative overflow-hidden"
        disabled={isAnalyzing}
      >
        {currentStep < totalSteps - 1 ? "Next Category" : 
         round === 1 ? "Proceed to Detailed Analysis" : "Complete Analysis"}
        {isAnalyzing && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="loading-bar" />
          </div>
        )}
      </Button>
    </div>
  );
};