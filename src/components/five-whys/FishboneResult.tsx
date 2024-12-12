import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Analysis {
  fishboneDiagram: string;
  rootCause: string;
  correctiveActions: string[];
  preventiveActions: string[];
  learningFeedback?: { iteration: number; feedback: string; }[];
}

interface FishboneResultProps {
  analysis: Analysis;
  onReset: () => void;
}

export const FishboneResult = ({ analysis, onReset }: FishboneResultProps) => {
  // Parse the sequential problems from the fishbone data
  const problems = analysis.fishboneDiagram
    .split('\n')
    .filter(line => line.includes('. '))
    .map(line => line.split('. ')[1]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <Button variant="outline" onClick={onReset}>
          New Analysis
        </Button>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Five Whys Sequence</h3>
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <div key={index} className="flex gap-3">
              <span className="font-medium text-muted-foreground">Why {index + 1}:</span>
              <p>{problem}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Root Cause</h3>
        <p className="text-sm">{analysis.rootCause}</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Corrective Actions</h3>
        <div className="space-y-2">
          {analysis.correctiveActions.map((action, index) => (
            <p key={index} className="text-sm">• {action}</p>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Preventive Actions</h3>
        <div className="space-y-2">
          {analysis.preventiveActions.map((action, index) => (
            <p key={index} className="text-sm">• {action}</p>
          ))}
        </div>
      </Card>

      {analysis.learningFeedback && analysis.learningFeedback.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Learning Notes</h3>
          <div className="space-y-4">
            {analysis.learningFeedback.map((item, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <p className="text-sm font-medium">Iteration {item.iteration}</p>
                <p className="text-sm mt-1">{item.feedback}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};