import { Card } from "@/components/ui/card";

interface FiveSEvaluationSummaryProps {
  workcenterName: string;
  averageScore: number;
  evaluationDate: string;
}

export const FiveSEvaluationSummary = ({ workcenterName, averageScore, evaluationDate }: FiveSEvaluationSummaryProps) => {
  const percentageScore = (averageScore / 50) * 100;

  return (
    <div className="space-y-2 mt-4">
      <p><span className="font-medium">Workcenter:</span> {workcenterName}</p>
      <p><span className="font-medium">Score:</span> {percentageScore.toFixed(1)}% ({averageScore.toFixed(1)} / 50 points)</p>
      <p><span className="font-medium">Evaluation Date:</span> {evaluationDate}</p>
    </div>
  );
};