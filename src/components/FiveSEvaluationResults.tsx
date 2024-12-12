import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FiveSEvaluationHeader } from "@/components/FiveSEvaluationHeader";
import { FiveSEvaluationSummary } from "@/components/FiveSEvaluationSummary";
import { FiveSEvaluationImages } from "@/components/FiveSEvaluationImages";
import { FiveSRadarChart } from "@/components/FiveSRadarChart";
import { SWOTAnalysis } from "@/components/SWOTAnalysis";
import { FiveSTrend } from "@/components/FiveSTrend";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';

interface FiveSEvaluationResultsProps {
  evaluation: any;
  onNewEvaluation: () => void;
  isLoading: boolean;
}

export const FiveSEvaluationResults = ({ 
  evaluation, 
  onNewEvaluation,
  isLoading 
}: FiveSEvaluationResultsProps) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [needsLearning, setNeedsLearning] = useState(false);

  const handleSavePDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });

      const element = document.getElementById('evaluation-content');
      if (!element) return;

      const opt = {
        margin: 5,
        filename: `5S-Evaluation-${evaluation.workcenter?.name}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 1, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait', compress: true }
      };

      await html2pdf().set(opt).from(element).save();

      toast({
        title: "Success",
        description: "PDF report has been generated and downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitFeedback = async () => {
    if (!needsLearning || !feedback.trim()) return;

    try {
      const { error } = await supabase
        .from('five_s_learning_feedback')
        .insert({
          evaluation_id: evaluation.id,
          feedback,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping improve our analysis system.",
      });

      setFeedback("");
      setNeedsLearning(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2">Loading evaluation results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FiveSEvaluationHeader
        workcenterId={evaluation.workcenter_id}
        onSavePDF={handleSavePDF}
      />

      <div id="evaluation-content" className="scale-[0.85] origin-top">
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

          <Card className="p-4 mt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="learning"
                checked={needsLearning}
                onCheckedChange={(checked) => setNeedsLearning(checked as boolean)}
              />
              <label
                htmlFor="learning"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Provide learning feedback
              </label>
            </div>

            {needsLearning && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Please describe what could be improved in this analysis..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleSubmitFeedback}>
                  Submit Feedback
                </Button>
              </div>
            )}
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
      </div>
    </div>
  );
};