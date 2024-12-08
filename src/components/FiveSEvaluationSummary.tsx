import { Card } from "@/components/ui/card";

interface FiveSEvaluationSummaryProps {
  workcenterName: string;
  averageScore: number;
  safetyDeduction: number;
  evaluationDate: string;
}

export const FiveSEvaluationSummary = ({ 
  workcenterName, 
  averageScore, 
  safetyDeduction,
  evaluationDate 
}: FiveSEvaluationSummaryProps) => {
  const finalScore = Math.max(0, averageScore + safetyDeduction);
  const percentageScore = (finalScore / 50) * 100;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workcenterName}</h2>
          <p className="text-gray-600">{evaluationDate}</p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold text-primary">
            {percentageScore.toFixed(1)}%
          </div>
          <p className="text-lg text-gray-600">
            Base Score: {averageScore.toFixed(1)} / 50
            {safetyDeduction < 0 && (
              <span className="text-red-500 ml-2">
                (Safety deduction: {safetyDeduction})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};