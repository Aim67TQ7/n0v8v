import { Checkbox } from "@/components/ui/checkbox";

interface Cause {
  id: string;
  text: string;
  checked: boolean;
}

interface CausesListProps {
  causes: Cause[];
  onCauseToggle: (causeId: string, checked: boolean) => void;
  currentIteration: number;
  isAnalyzing: boolean;
  onNext: () => void;
  onReset: () => void;
}

export const CausesList = ({
  causes,
  onCauseToggle,
  currentIteration,
  isAnalyzing,
  onNext,
  onReset,
}: CausesListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Iteration {currentIteration} of 5</h2>
        <Button variant="outline" onClick={onReset}>
          Start Over
        </Button>
      </div>
      <div className="space-y-4">
        {causes.map((cause) => (
          <div key={cause.id} className="flex items-start space-x-2">
            <Checkbox
              id={cause.id}
              checked={cause.checked}
              onCheckedChange={(checked) => onCauseToggle(cause.id, checked as boolean)}
            />
            <label
              htmlFor={cause.id}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {cause.text}
            </label>
          </div>
        ))}
      </div>
      <Button 
        onClick={onNext} 
        disabled={isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? "Processing..." : currentIteration === 5 ? "Generate Fishbone" : "Next"}
      </Button>
    </div>
  );
};