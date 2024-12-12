import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisFeedbackButtonsProps {
  processImprovementId?: string;
  partInspectionId?: string;
  inspectionTypeId?: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onTrainingClick: () => void;
}

export const AnalysisFeedbackButtons = ({
  processImprovementId,
  partInspectionId,
  inspectionTypeId,
  isSubmitting,
  setIsSubmitting,
  onTrainingClick
}: AnalysisFeedbackButtonsProps) => {
  const { toast } = useToast();

  const handleFeedback = async (feedbackType: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('part_analysis_feedback')
        .insert({
          process_improvement_id: processImprovementId,
          part_inspection_id: partInspectionId,
          inspection_type_id: inspectionTypeId,
          feedback_type: feedbackType,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Feedback error:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        onClick={() => handleFeedback('helpful')}
        disabled={isSubmitting}
      >
        <ThumbsUp className="w-4 h-4 mr-2" />
        Helpful
      </Button>
      <Button
        variant="outline"
        onClick={() => handleFeedback('not_helpful')}
        disabled={isSubmitting}
      >
        <ThumbsDown className="w-4 h-4 mr-2" />
        Not Helpful
      </Button>
      <Button
        variant="outline"
        onClick={onTrainingClick}
        disabled={isSubmitting}
      >
        <GraduationCap className="w-4 h-4 mr-2" />
        Needs Training
      </Button>
    </div>
  );
};