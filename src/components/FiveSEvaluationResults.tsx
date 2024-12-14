import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FiveSEvaluationHeader } from "@/components/FiveSEvaluationHeader";
import { FiveSEvaluationSummary } from "@/components/FiveSEvaluationSummary";
import { FiveSEvaluationImages } from "@/components/FiveSEvaluationImages";
import { FiveSRadarChart } from "@/components/FiveSRadarChart";
import { SWOTAnalysis } from "@/components/SWOTAnalysis";
import { FiveSTrend } from "@/components/FiveSTrend";
import { ScoreAnalysis } from "@/components/analysis/ScoreAnalysis";
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
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [evaluationImages, setEvaluationImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        const { data: evalData, error: evalError } = await supabase
          .from('five_s_evaluations')
          .select(`
            *,
            workcenter:workcenters(name),
            evaluation_images(image_url)
          `)
          .eq('id', evaluation)
          .single();

        if (evalError) throw evalError;
        
        setEvaluationData(evalData);
        setEvaluationImages(evalData.evaluation_images || []);
      } catch (error) {
        console.error('Error fetching evaluation:', error);
        toast({
          title: "Error",
          description: "Failed to load evaluation data",
          variant: "destructive"
        });
      }
    };

    if (evaluation) {
      fetchEvaluationData();
    }
  }, [evaluation, toast]);

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
        filename: `5S-Evaluation-${evaluationData?.workcenter?.name}-${new Date().toISOString().split('T')[0]}.pdf`,
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

  if (isLoading || !evaluationData) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2">Loading evaluation results...</p>
      </div>
    );
  }

  const baseScores = evaluationData.sort_score + evaluationData.set_in_order_score + evaluationData.shine_score;
  const canShowAdvancedScores = baseScores >= 20;

  return (
    <div className="space-y-8">
      <FiveSEvaluationHeader
        workcenterId={evaluationData.workcenter_id}
        onSavePDF={handleSavePDF}
      />

      <div id="evaluation-content" className="scale-[0.85] origin-top">
        <Card className="p-4">
          <FiveSEvaluationSummary
            workcenterName={evaluationData.workcenter?.name}
            evaluationDate={new Date(evaluationData.created_at).toLocaleDateString()}
            scores={evaluationData}
          />
          
          <FiveSEvaluationImages images={evaluationImages} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">5S Scores</h3>
                <FiveSRadarChart 
                  scores={evaluationData} 
                  canShowAdvancedScores={canShowAdvancedScores}
                />
              </Card>
            </div>

            <div>
              <ScoreAnalysis
                sortScore={evaluationData.sort_score}
                setScore={evaluationData.set_in_order_score}
                shineScore={evaluationData.shine_score}
                standardizeScore={canShowAdvancedScores ? evaluationData.standardize_score : 0}
                sustainScore={canShowAdvancedScores ? evaluationData.sustain_score : 0}
                weaknesses={evaluationData.weaknesses || []}
                canShowAdvancedScores={canShowAdvancedScores}
              />
            </div>

            <div className="space-y-4">
              <FiveSTrend workcenterId={evaluationData.workcenter_id} />
              <SWOTAnalysis
                evaluationId={evaluationData.id}
                sortScore={evaluationData.sort_score}
                setScore={evaluationData.set_in_order_score}
                shineScore={evaluationData.shine_score}
                strengths={evaluationData.strengths || []}
                weaknesses={evaluationData.weaknesses || []}
              />
            </div>
          </div>

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