import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveTrainingData } from "@/services/fiveSEvaluationService";
import { StrengthsWeaknesses } from "./analysis/StrengthsWeaknesses";
import { ScoreAnalysis } from "./analysis/ScoreAnalysis";
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
  const [isGood, setIsGood] = useState(false);
  const [needsImprovement, setNeedsImprovement] = useState(false);
  const [trainingFeedback, setTrainingFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!evaluationId) return;

    try {
      setIsSubmitting(true);

      // Get the evaluation data including images
      const { data: evaluation, error: evalError } = await supabase
        .from('five_s_evaluations')
        .select(`
          *,
          evaluation_images(image_url)
        `)
        .eq('id', evaluationId)
        .single();

      if (evalError) throw evalError;

      const imageUrls = evaluation.evaluation_images.map((img: any) => img.image_url);

      await saveTrainingData(
        evaluationId,
        trainingFeedback,
        imageUrls,
        {
          strengths,
          weaknesses,
          scores: {
            sort: sortScore,
            set: setScore,
            shine: shineScore
          }
        }
      );

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping train the model.",
      });

      setTrainingFeedback("");
      setIsGood(false);
      setNeedsImprovement(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowAllWeaknesses = (sortScore === undefined || setScore === undefined || shineScore === undefined) || 
    (sortScore >= 8 && setScore >= 8 && shineScore >= 8);
  
  const filteredWeaknesses = shouldShowAllWeaknesses ? weaknesses : 
    weaknesses.filter(weakness => 
      (sortScore < 8 && weakness.toLowerCase().includes('sort')) || 
      (setScore < 8 && weakness.toLowerCase().includes('set in order')) ||
      (shineScore < 8 && weakness.toLowerCase().includes('shine'))
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StrengthsWeaknesses 
        strengths={strengths}
        weaknesses={weaknesses}
        shouldShowAllWeaknesses={shouldShowAllWeaknesses}
        filteredWeaknesses={filteredWeaknesses}
      />

      <div className="space-y-4">
        <ScoreAnalysis
          sortScore={sortScore}
          setScore={setScore}
          shineScore={shineScore}
          weaknesses={weaknesses}
        />

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Train the Model</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="good"
                  checked={isGood}
                  onCheckedChange={(checked) => {
                    setIsGood(checked as boolean);
                    if (checked) setNeedsImprovement(false);
                  }}
                />
                <label htmlFor="good" className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  Good Analysis
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="improve"
                  checked={needsImprovement}
                  onCheckedChange={(checked) => {
                    setNeedsImprovement(checked as boolean);
                    if (checked) setIsGood(false);
                  }}
                />
                <label htmlFor="improve" className="flex items-center text-sm">
                  <Edit2 className="w-4 h-4 mr-1 text-yellow-500" />
                  Needs Improvement
                </label>
              </div>
            </div>

            {(isGood || needsImprovement) && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Provide training comments to help improve the model..."
                  value={trainingFeedback}
                  onChange={(e) => setTrainingFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !trainingFeedback.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Training Feedback
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};