import { Card } from "@/components/ui/card";

interface FiveSEvaluationSummaryProps {
  workcenterName: string;
  averageScore: number;
  evaluationDate: string;
}

export const FiveSEvaluationSummary = ({ workcenterName, averageScore, evaluationDate }: FiveSEvaluationSummaryProps) => {
  const percentageScore = (averageScore / 50) * 100;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workcenterName}</h2>
          <p className="text-gray-600">{evaluationDate}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">
            {percentageScore.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">({averageScore.toFixed(1)} / 50 points)</p>
        </div>
      </div>
    </div>
  );
};