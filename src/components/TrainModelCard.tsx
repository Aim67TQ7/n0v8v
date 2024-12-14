import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrainModelCardProps {
  toolType: string;
  resourceId: string;
  metadata?: Record<string, any>;
}

export const TrainModelCard = ({ toolType, resourceId, metadata }: TrainModelCardProps) => {
  const { toast } = useToast();
  const [trainingFeedback, setTrainingFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!resourceId || !trainingFeedback.trim()) return;

    try {
      setIsSubmitting(true);

      // Save the training feedback
      const { error } = await supabase
        .from(`${toolType}_learning_feedback`)
        .insert({
          [`${toolType}_id`]: resourceId,
          feedback: trainingFeedback,
          metadata: metadata || {}
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping train the model.",
      });

      setTrainingFeedback("");
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

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Train the Model</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please provide feedback to improve the model's accuracy
        </p>
        
        <Textarea
          placeholder="Enter your feedback..."
          value={trainingFeedback}
          onChange={(e) => setTrainingFeedback(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button 
          onClick={handleSubmitFeedback}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};