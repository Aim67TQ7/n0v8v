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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">5S Scores</h3>
        <FiveSRadarChart 
          scores={evaluationData} 
          canShowAdvancedScores={canShowAdvancedScores}
        />
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {evaluationData.workcenter?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(evaluationData.created_at), 'PPP')}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {scorePercentage.toFixed(1)}%
            </div>
            <div className="text-xl text-muted-foreground mt-1">
              {totalScore.toFixed(1)}/50
            </div>
            
            {scoreDifference !== null && (
              <div className={`flex items-center justify-center mt-2 ${
                scoreDifference > 0 ? 'text-green-600' : scoreDifference < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {scoreDifference > 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : scoreDifference < 0 ? (
                  <TrendingDown className="w-5 h-5 mr-1" />
                ) : null}
                <span>{Math.abs(scoreDifference).toFixed(1)} points {scoreDifference > 0 ? 'improvement' : 'decrease'}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Historical 5S Performance</h3>
        <FiveSTrend workcenterId={evaluationData.workcenter_id} />
      </Card>
    </div>
  );
};