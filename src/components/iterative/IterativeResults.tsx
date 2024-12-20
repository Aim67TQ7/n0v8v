import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, RotateCcw } from "lucide-react";

interface IterativeResultsProps {
  analysis: {
    rootCause: string;
    solutions: {
      title: string;
      steps: string[];
    }[];
    followUpPlan: string;
  };
  onReset: () => void;
}

export const IterativeResults = ({ analysis, onReset }: IterativeResultsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
        <Card className="p-4 bg-muted">
          <h3 className="font-medium mb-2">Root Cause</h3>
          <p className="text-muted-foreground">{analysis.rootCause}</p>
        </Card>
      </div>

      <div>
        <h3 className="font-medium mb-3">Recommended Actions</h3>
        <div className="space-y-4">
          {analysis.solutions.map((solution, index) => (
            <Card key={index} className="p-4">
              <h4 className="font-medium mb-2">{solution.title}</h4>
              <ul className="space-y-2">
                {solution.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-1 text-green-500" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Follow-up Plan</h3>
        <Card className="p-4">
          <p className="text-muted-foreground">{analysis.followUpPlan}</p>
        </Card>
      </div>

      <Button 
        onClick={onReset}
        variant="outline"
        className="w-full"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Start New Analysis
      </Button>
    </div>
  );
};