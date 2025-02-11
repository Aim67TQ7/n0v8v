import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface AnalysisContentProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
  } | null;
}

export const AnalysisContent = ({ analysis }: AnalysisContentProps) => {
  if (!analysis) return null;

  const detailLines = analysis.details ? analysis.details.split('\n') : [];

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
        {detailLines.map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>
    </Card>
  );
};