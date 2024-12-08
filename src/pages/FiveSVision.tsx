import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { FiveSVisionImageUploader } from "@/components/FiveSVisionImageUploader";
import { FiveSRadarChart } from "@/components/FiveSRadarChart";
import { SWOTAnalysis } from "@/components/SWOTAnalysis";
import { FiveSTrend } from "@/components/FiveSTrend";
import { FiveSEvaluationHeader } from "@/components/FiveSEvaluationHeader";
import { FiveSEvaluationSummary } from "@/components/FiveSEvaluationSummary";
import { FiveSEvaluationImages } from "@/components/FiveSEvaluationImages";
import { uploadImages, analyzeImages, createEvaluation, saveImageReferences } from "@/services/fiveSEvaluationService";
import { supabase } from "@/integrations/supabase/client";

// Let's extract the evaluation display into a separate component
const EvaluationDisplay = ({ evaluation, onNewEvaluation }: { 
  evaluation: any; 
  onNewEvaluation: () => void;
}) => {
  const { toast } = useToast();
  
  const calculateAverageScore = (evaluation: any) => {
    if (!evaluation) return 0;
    const scores = [
      evaluation.sort_score,
      evaluation.set_in_order_score,
      evaluation.shine_score,
      evaluation.standardize_score,
      evaluation.sustain_score
    ];
    return scores.reduce((a, b) => a + b, 0);
  };

  const handleSavePDF = () => {
    toast({
      title: "Coming Soon",
      description: "PDF export functionality will be available soon",
    });
  };

  const handleEmailPDF = () => {
    toast({
      title: "Coming Soon",
      description: "Email PDF functionality will be available soon",
    });
  };

  return (
    <>
      <FiveSEvaluationHeader
        workcenterId={evaluation.workcenter_id}
        onSavePDF={handleSavePDF}
        onEmailPDF={handleEmailPDF}
      />

      <Card className="p-6">
        <FiveSEvaluationSummary
          workcenterName={evaluation.workcenter?.name}
          averageScore={calculateAverageScore(evaluation)}
          safetyDeduction={evaluation.safety_deduction || 0}
          evaluationDate={new Date(evaluation.created_at).toLocaleDateString()}
        />
        
        <FiveSEvaluationImages images={evaluation.evaluation_images} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">5S Scores</h3>
            <FiveSRadarChart scores={evaluation} />
          </Card>
          <FiveSTrend workcenterId={evaluation.workcenter_id} />
        </div>

        <Card className="p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Analysis & Recommendations</h3>
          <SWOTAnalysis
            strengths={evaluation.strengths || []}
            weaknesses={evaluation.weaknesses || []}
            opportunities={evaluation.opportunities || []}
            threats={evaluation.threats || []}
          />
        </Card>

        <div className="text-center mt-6">
          <Button
            onClick={onNewEvaluation}
            variant="outline"
          >
            Start New Evaluation
          </Button>
        </div>
      </Card>
    </>
  );
};

const FiveSVision = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: evaluation, isLoading: isLoadingEvaluation } = useQuery({
    queryKey: ['evaluation', evaluationId],
    queryFn: async () => {
      if (!evaluationId) return null;
      const { data, error } = await supabase
        .from('five_s_evaluations')
        .select(`
          *,
          workcenter:workcenters(name),
          evaluation_images(image_url)
        `)
        .eq('id', evaluationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!evaluationId
  });

  const handleSubmit = async () => {
    if (!selectedWorkcenter || images.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a workcenter and upload images",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      toast({
        title: "Analysis in Progress",
        description: "The AI is analyzing your images. This may take up to 60 seconds...",
      });
      
      const imageUrls = await uploadImages(images);
      const analysis = await analyzeImages(imageUrls);
      const evaluation = await createEvaluation(selectedWorkcenter, analysis);
      await saveImageReferences(evaluation.id, imageUrls);
      
      setEvaluationId(evaluation.id);
      toast({
        title: "Success",
        description: "5S evaluation completed successfully",
      });
      
      setImages([]);
      setSelectedWorkcenter("");
    } catch (error) {
      console.error('Error during evaluation:', error);
      toast({
        title: "Error",
        description: "Failed to complete 5S evaluation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!evaluationId ? (
        <Card className="p-6">
          <div className="space-y-6">
            <WorkcenterSelect 
              value={selectedWorkcenter} 
              onChange={setSelectedWorkcenter} 
            />

            <FiveSVisionImageUploader 
              images={images} 
              setImages={setImages} 
            />

            <Button
              onClick={handleSubmit}
              disabled={!selectedWorkcenter || images.length === 0 || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Images (This may take up to 60 seconds)...
                </>
              ) : (
                'Submit Evaluation'
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {isLoadingEvaluation ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="mt-2">Loading evaluation results...</p>
            </div>
          ) : evaluation && (
            <EvaluationDisplay 
              evaluation={evaluation} 
              onNewEvaluation={() => setEvaluationId(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FiveSVision;