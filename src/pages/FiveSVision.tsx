import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { FiveSVisionImageUploader } from "@/components/FiveSVisionImageUploader";
import { FiveSRadarChart } from "@/components/FiveSRadarChart";
import { SWOTAnalysis } from "@/components/SWOTAnalysis";
import { FiveSTrend } from "@/components/FiveSTrend";
import { uploadImages, analyzeImages, createEvaluation, saveImageReferences } from "@/services/fiveSEvaluationService";
import { supabase } from "@/integrations/supabase/client";

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
          workcenter:workcenters(name)
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
      console.log('Starting image upload...');
      
      const imageUrls = await uploadImages(images);
      console.log('Images uploaded:', imageUrls);
      
      const analysis = await analyzeImages(imageUrls);
      console.log('Analysis received:', analysis);
      
      const evaluation = await createEvaluation(selectedWorkcenter, analysis);
      console.log('Evaluation created:', evaluation);
      
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
        description: "Failed to complete 5S evaluation",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateAverageScore = (evaluation: any) => {
    if (!evaluation) return 0;
    const scores = [
      evaluation.sort_score,
      evaluation.set_in_order_score,
      evaluation.shine_score,
      evaluation.standardize_score,
      evaluation.sustain_score
    ];
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">5S Vision Evaluation</h1>
      </div>

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
                  Analyzing...
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
            <>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Results Summary</h2>
                    <div className="space-y-2">
                      <p><span className="font-medium">Workcenter:</span> {evaluation.workcenter?.name}</p>
                      <p><span className="font-medium">Average Score:</span> {calculateAverageScore(evaluation).toFixed(2)}</p>
                      <p><span className="font-medium">Evaluation Date:</span> {new Date(evaluation.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">5S Scores</h3>
                    <FiveSRadarChart scores={evaluation} />
                  </div>
                </div>
              </Card>

              <FiveSTrend workcenterId={evaluation.workcenter_id} />

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Analysis & Recommendations</h3>
                <SWOTAnalysis
                  strengths={evaluation.strengths || []}
                  weaknesses={evaluation.weaknesses || []}
                  opportunities={evaluation.opportunities || []}
                  threats={evaluation.threats || []}
                />
              </Card>

              <div className="text-center">
                <Button
                  onClick={() => setEvaluationId(null)}
                  variant="outline"
                >
                  Start New Evaluation
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FiveSVision;