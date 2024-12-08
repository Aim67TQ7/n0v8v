import { Card } from "@/components/ui/card";

interface ProcessAnalysisResultsProps {
  analysis: string;
}

export const ProcessAnalysisResults = ({ analysis }: ProcessAnalysisResultsProps) => {
  if (!analysis) return null;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      <div className="prose prose-sm">
        {analysis.split('\n').map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>
    </Card>
  );
};