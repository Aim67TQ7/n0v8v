import { Card } from "@/components/ui/card";
import { getScoreImpactSummary } from "@/utils/scoreAnalysis";

interface ScoreAnalysisProps {
  sortScore?: number;
  setScore?: number;
  shineScore?: number;
  weaknesses: string[];
}

export const ScoreAnalysis = ({ 
  sortScore, 
  setScore, 
  shineScore,
  weaknesses 
}: ScoreAnalysisProps) => {
  const getStartingPoint = (scores: { sort?: number, set?: number, shine?: number }) => {
    const lowestScore = Math.min(...Object.values(scores).filter(score => score !== undefined) as number[]);
    if (lowestScore === scores.sort) {
      return "Focus on removing unnecessary items and implementing a red tag system to improve Sort score.";
    }
    if (lowestScore === scores.set) {
      return "Implement visual management systems and designated storage locations to improve Set in Order score.";
    }
    return "Establish daily cleaning schedules and standards to improve Shine score.";
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-primary mb-2">Detailed 5S Analysis</h3>
      
      <div className="space-y-6">
        {['Sort', 'Set in Order', 'Shine'].map((category, index) => {
          const score = [sortScore, setScore, shineScore][index];
          const categoryLower = category.toLowerCase();
          
          return (
            <div key={category}>
              <h4 className="font-medium text-sm mb-2">{category} ({score}/10)</h4>
              <p className="text-sm text-gray-700 mb-2">
                {getScoreImpactSummary(score, category)}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {weaknesses
                  .filter(w => w.toLowerCase().includes(categoryLower))
                  .map((item, i) => (
                    <li key={i} className="text-gray-700">{item}</li>
                  ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-sm mb-3">Recommended Starting Point:</h4>
        <p className="text-sm text-gray-700">
          {getStartingPoint({ sort: sortScore, set: setScore, shine: shineScore })}
        </p>
      </div>
    </Card>
  );
};