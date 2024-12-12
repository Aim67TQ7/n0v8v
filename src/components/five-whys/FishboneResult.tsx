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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <Button variant="outline" onClick={onReset}>
          New Analysis
        </Button>
      </div>
      
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Fishbone Analysis</h3>
        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
          {analysis.fishboneDiagram}
        </pre>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Root Cause</h3>
        <p className="text-sm">{analysis.rootCause}</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Corrective Actions</h3>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.correctiveActions.map((action, index) => (
            <li key={index} className="text-sm">{action}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Preventive Actions</h3>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.preventiveActions.map((action, index) => (
            <li key={index} className="text-sm">{action}</li>
          ))}
        </ul>
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