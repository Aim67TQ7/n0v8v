import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiveSEvaluationSummary } from "@/components/FiveSEvaluationSummary";
import { FiveSEvaluationImages } from "@/components/FiveSEvaluationImages";
import { FiveSRadarChart } from "@/components/FiveSRadarChart";
import { SWOTAnalysis } from "@/components/SWOTAnalysis";
import { FiveSTrend } from "@/components/FiveSTrend";

interface FiveSEvaluationContentProps {
  evaluation: any;
  onNewEvaluation: () => void;
}

export const FiveSEvaluationContent = ({ 
  evaluation, 
  onNewEvaluation 
}: FiveSEvaluationContentProps) => {
  return (
    <Card className="p-4">
      <FiveSEvaluationSummary
        workcenterName={evaluation.workcenter?.name}
        evaluationDate={new Date(evaluation.created_at).toLocaleDateString()}
        scores={evaluation}
      />
      
      <FiveSEvaluationImages images={evaluation.evaluation_images} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">5S Scores</h3>
          <FiveSRadarChart scores={evaluation} />
        </Card>
        <FiveSTrend workcenterId={evaluation.workcenter_id} />
      </div>

      <Card className="p-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Analysis & Recommendations</h3>
        <SWOTAnalysis
          strengths={evaluation.strengths || []}
          weaknesses={evaluation.weaknesses || []}
          sortScore={evaluation.sort_score}
          setScore={evaluation.set_in_order_score}
          shineScore={evaluation.shine_score}
        />
      </Card>

      <div className="text-center mt-4">
        <Button
          onClick={onNewEvaluation}
          variant="outline"
          size="sm"
        >
          Start New Evaluation
        </Button>
      </div>
    </Card>
  );
};