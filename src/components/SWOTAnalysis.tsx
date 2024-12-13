import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SWOTAnalysisProps {
  strengths: string[];
  weaknesses: string[];
  sortScore?: number;
  setScore?: number;
  shineScore?: number;
  evaluationId?: string;
}

export const SWOTAnalysis = ({ 
  strengths, 
  weaknesses, 
  sortScore, 
  setScore, 
  shineScore,
  evaluationId 
}: SWOTAnalysisProps) => {
  const { toast } = useToast();
  
  const renderList = (items: string[]) => (
    <ul className="list-disc pl-5 space-y-4">
      {items.map((item, index) => (
        <li key={index} className="text-sm">{item}</li>
      ))}
    </ul>
  );

  const shouldShowAllWeaknesses = (sortScore === undefined || setScore === undefined || shineScore === undefined) || 
    (sortScore >= 8 && setScore >= 8 && shineScore >= 8);
  
  const filteredWeaknesses = shouldShowAllWeaknesses ? weaknesses : 
    weaknesses.filter(weakness => 
      (sortScore < 8 && weakness.toLowerCase().includes('sort')) || 
      (setScore < 8 && weakness.toLowerCase().includes('set in order')) ||
      (shineScore < 8 && weakness.toLowerCase().includes('shine'))
    );

  const getScoreImpactSummary = (score: number | undefined, category: string) => {
    if (score === undefined) return "";
    if (score >= 8) return `Strong ${category} practices with minimal issues.`;
    if (score >= 6) return `Some ${category} challenges affecting efficiency.`;
    return `Significant ${category} issues impacting operations.`;
  };

  const handleFeedback = async (category: string, isAccurate: boolean) => {
    if (!evaluationId) return;

    try {
      const { error } = await supabase
        .from('five_s_learning_feedback')
        .insert({
          evaluation_id: evaluationId,
          feedback: `AI analysis for ${category} was ${isAccurate ? 'accurate' : 'inaccurate'}`,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping improve our analysis system.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Column - Stacked Observations & Strengths */}
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold text-green-600 mb-2">Observations & Strengths</h3>
          <p className="text-sm text-gray-600 mb-3">
            Document positive practices: organized workspaces, labeled storage, clean equipment,
            standardized procedures, and sustained improvements.
          </p>
          {renderList(strengths)}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-red-600 mb-2">Areas for Improvement</h3>
          <p className="text-sm text-gray-600 mb-3">
            Each finding identifies a specific issue, its impact on operations,
            and provides a practical solution with expected benefits.
          </p>
          {renderList(filteredWeaknesses)}
        </Card>
      </div>

      {/* Right Column - Detailed 5S Analysis */}
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold text-primary mb-2">Detailed 5S Analysis</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Sort (Seiri)</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-100 hover:bg-green-200"
                    onClick={() => handleFeedback('Sort', true)}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-100 hover:bg-red-200"
                    onClick={() => handleFeedback('Sort', false)}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Score: {sortScore}/10</p>
              <p className="text-sm text-gray-700 mb-2">{getScoreImpactSummary(sortScore, 'Sort')}</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {weaknesses.filter(w => w.toLowerCase().includes('sort')).map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Set in Order (Seiton)</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-100 hover:bg-green-200"
                    onClick={() => handleFeedback('Set in Order', true)}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-100 hover:bg-red-200"
                    onClick={() => handleFeedback('Set in Order', false)}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Score: {setScore}/10</p>
              <p className="text-sm text-gray-700 mb-2">{getScoreImpactSummary(setScore, 'Set in Order')}</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {weaknesses.filter(w => w.toLowerCase().includes('set in order')).map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Shine (Seiso)</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-100 hover:bg-green-200"
                    onClick={() => handleFeedback('Shine', true)}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-100 hover:bg-red-200"
                    onClick={() => handleFeedback('Shine', false)}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Score: {shineScore}/10</p>
              <p className="text-sm text-gray-700 mb-2">{getScoreImpactSummary(shineScore, 'Shine')}</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {weaknesses.filter(w => w.toLowerCase().includes('shine')).map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Recommended Starting Point:</h4>
            <p className="text-sm text-gray-700">
              {getStartingPoint({ sort: sortScore, set: setScore, shine: shineScore })}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};