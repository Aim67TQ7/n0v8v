import { Button } from "@/components/ui/button";
import { ThumbsUp, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisFeedbackButtonsProps {
  processImprovementId?: string;
  inspectionTypeId?: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onTrainingClick: () => void;
}

export const AnalysisFeedbackButtons = ({
  processImprovementId,
  inspectionTypeId,
  isSubmitting,
  setIsSubmitting,
  onTrainingClick
}: AnalysisFeedbackButtonsProps) => {
  const { toast } = useToast();

  const handleAgree = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('part_analysis_feedback')
        .insert({
          process_improvement_id: processImprovementId,
          feedback_type: 'agreement',
          inspection_type_id: inspectionTypeId,
          created_by: (await supabase.auth.getUser()).data.user?.id
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

  return (
    <div className="flex gap-4 mt-6">
      <Button
        onClick={handleAgree}
        disabled={isSubmitting || !processImprovementId}
        className="flex items-center gap-2"
      >
        <ThumbsUp className="h-4 w-4" />
        Agree with Analysis
      </Button>
      <Button
        onClick={onTrainingClick}
        disabled={isSubmitting || !processImprovementId}
        variant="outline"
        className="flex items-center gap-2"
      >
        <BookOpen className="h-4 w-4" />
        Add Training Notes
      </Button>
    </div>
  );
};