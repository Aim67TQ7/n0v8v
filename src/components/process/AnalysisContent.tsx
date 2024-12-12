import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, ThumbsUp, BookOpen } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AnalysisContentProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
  } | null;
  processImprovementId?: string;
  inspectionTypeId?: string;
}

export const AnalysisContent = ({ analysis, processImprovementId, inspectionTypeId }: AnalysisContentProps) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingComment, setTrainingComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!analysis) return null;

  const detailLines = analysis.details ? analysis.details.split('\n') : [];

  const handleAgree = async () => {
    if (!processImprovementId) {
      toast({
        title: "Error",
        description: "Process improvement ID is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('part_analysis_feedback')
        .insert({
          process_improvement_id: processImprovementId,
          feedback_type: 'agreement',
          inspection_type_id: inspectionTypeId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Analysis agreement recorded",
      });
    } catch (error) {
      console.error('Error recording agreement:', error);
      toast({
        title: "Error",
        description: "Failed to record agreement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrainingSubmit = async () => {
    if (!processImprovementId || !trainingComment.trim()) {
      toast({
        title: "Error",
        description: "Process improvement ID and comment are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('part_analysis_feedback')
        .insert({
          process_improvement_id: processImprovementId,
          feedback_type: 'training',
          comments: trainingComment,
          inspection_type_id: inspectionTypeId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training feedback submitted",
      });
      setIsTraining(false);
      setTrainingComment("");
    } catch (error) {
      console.error('Error submitting training:', error);
      toast({
        title: "Error",
        description: "Failed to submit training feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {analysis.status === 'success' ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        )}
        <h2 className="text-xl font-semibold">{analysis.message}</h2>
      </div>
      <div className="prose prose-sm mb-6">
        {detailLines.map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleAgree}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ThumbsUp className="h-4 w-4" />
          Agree with Analysis
        </Button>
        <Button
          onClick={() => setIsTraining(true)}
          disabled={isSubmitting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Add Training Notes
        </Button>
      </div>

      {isTraining && (
        <div className="mt-6 space-y-4">
          <Textarea
            placeholder="Enter your training notes here..."
            value={trainingComment}
            onChange={(e) => setTrainingComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-4">
            <Button
              onClick={handleTrainingSubmit}
              disabled={isSubmitting || !trainingComment.trim()}
            >
              Submit Training Notes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsTraining(false);
                setTrainingComment("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};