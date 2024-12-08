import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ProcessAnalysisResultsProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
  } | null;
}

export const ProcessAnalysisResults = ({ analysis }: ProcessAnalysisResultsProps) => {
  if (!analysis) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {analysis.status === 'success' ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        )}
        <h2 className="text-xl font-semibold">{analysis.message}</h2>
      </div>
      <div className="prose prose-sm">
        {analysis.details.split('\n').map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>
    </Card>
  );
};