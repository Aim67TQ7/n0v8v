interface FiveSEvaluationSummaryProps {
  workcenterName: string;
  evaluationDate: string;
}

export const FiveSEvaluationSummary = ({ workcenterName, evaluationDate }: FiveSEvaluationSummaryProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workcenterName}</h2>
          <p className="text-gray-600">{evaluationDate}</p>
        </div>
      </div>
    </div>
  );
};