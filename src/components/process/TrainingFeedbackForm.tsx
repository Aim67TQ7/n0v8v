import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrainingFeedbackFormProps {
  processImprovementId?: string;
  partInspectionId?: string;
  inspectionTypeId?: string;
  onCancel: () => void;
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export const TrainingFeedbackForm = ({
  processImprovementId,
  partInspectionId,
  inspectionTypeId,
  onCancel,
  onSuccess,
  isSubmitting,
  setIsSubmitting
}: TrainingFeedbackFormProps) => {
  const [trainingComment, setTrainingComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!trainingComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter training notes",
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
          part_inspection_id: partInspectionId,
          inspection_type_id: inspectionTypeId,
          feedback_type: 'training',
          comments: trainingComment,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training feedback submitted",
      });
      onSuccess();
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
    <div className="mt-6 space-y-4">
      <Textarea
        placeholder="Enter your training notes here..."
        value={trainingComment}
        onChange={(e) => setTrainingComment(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !trainingComment.trim()}
        >
          Submit Training Notes
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};