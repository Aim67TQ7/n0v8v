import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { FiveSRadarChart } from "@/components/FiveSRadarChart";
import { FiveSTrend } from "@/components/FiveSTrend";
import { format } from "date-fns";

interface FiveSScoreCardsProps {
  evaluationData: any;
  totalScore: number;
  scorePercentage: number;
  scoreDifference: number | null;
  canShowAdvancedScores: boolean;
}

export const FiveSScoreCards = ({ 
  evaluationData, 
  totalScore, 
  scorePercentage, 
  scoreDifference,
  canShowAdvancedScores 
}: FiveSScoreCardsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[80%] mx-auto">
        <Card className="p-3">
          <div className="space-y-2">
            <div className="text-center py-2">
              <div className="text-3xl font-bold text-primary">
                {scorePercentage.toFixed(1)}%
              </div>
              <div className="text-lg text-muted-foreground">
                {totalScore.toFixed(1)}/50
              </div>
              
              {scoreDifference !== null && (
                <div className={`flex items-center justify-center mt-1 ${
                  scoreDifference > 0 ? 'text-green-600' : scoreDifference < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {scoreDifference > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : scoreDifference < 0 ? (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  ) : null}
                  <span>{Math.abs(scoreDifference).toFixed(1)} points {scoreDifference > 0 ? 'improvement' : 'decrease'}</span>
                </div>
              )}
            </div>

            <div className="h-[340px]">
              <FiveSRadarChart 
                scores={evaluationData} 
                canShowAdvancedScores={canShowAdvancedScores}
              />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-primary">
                {evaluationData.workcenter?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(evaluationData.created_at), 'PPP')}
              </p>
            </div>
            <div className="h-[340px]">
              <FiveSTrend workcenterId={evaluationData.workcenter_id} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};