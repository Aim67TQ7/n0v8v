interface FiveSEvaluationSummaryProps {
  workcenterName: string;
  evaluationDate: string;
  scores: {
    sort_score: number;
    set_in_order_score: number;
    shine_score: number;
    standardize_score: number;
    sustain_score: number;
  };
}

export const FiveSEvaluationSummary = ({ workcenterName, evaluationDate, scores }: FiveSEvaluationSummaryProps) => {
  const totalScore = (
    (scores.sort_score || 0) +
    (scores.set_in_order_score || 0) +
    (scores.shine_score || 0) +
    (scores.standardize_score || 0) +
    (scores.sustain_score || 0)
  );
  
  const scorePercentage = (totalScore / 50) * 100;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workcenterName}</h2>
          <p className="text-gray-600">{evaluationDate}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {scorePercentage.toFixed(1)}%
          </p>
          <p className="text-gray-600 text-sm">
            Score: {totalScore.toFixed(1)} / 50
          </p>
        </div>
      </div>
    </div>
  );
};