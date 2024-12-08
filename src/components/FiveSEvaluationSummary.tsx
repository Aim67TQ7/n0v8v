import { Card } from "@/components/ui/card";

interface FiveSEvaluationSummaryProps {
  workcenterName: string;
  averageScore: number;
  evaluationDate: string;
}

export const FiveSEvaluationSummary = ({ workcenterName, averageScore, evaluationDate }: FiveSEvaluationSummaryProps) => {
  return (
    <div className="space-y-2 mt-4">
      <p><span className="font-medium">Workcenter:</span> {workcenterName}</p>
      <p><span className="font-medium">Average Score:</span> {averageScore.toFixed(2)}</p>
      <p><span className="font-medium">Evaluation Date:</span> {evaluationDate}</p>
    </div>
  );
};