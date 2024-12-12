import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface PartAnalysisFeedbackProps {
  inspectionId: string;
}

export const PartAnalysisFeedback = ({ inspectionId }: PartAnalysisFeedbackProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [partName, setPartName] = useState("");
  const [material, setMaterial] = useState("");
  const [isAccurate, setIsAccurate] = useState(true);
  const [needsLearning, setNeedsLearning] = useState(false);
  const [learningFeedback, setLearningFeedback] = useState("");

  const handleSubmitFeedback = async () => {
    try {
      const { error } = await supabase.from('part_inspection_feedback').insert({
        inspection_id: inspectionId,
        part_name: partName,
        material: material,
        results_accurate: isAccurate,
        learning_feedback: needsLearning ? learningFeedback : null,
        created_by: session?.user?.id
      });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping improve our analysis system.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Analysis Feedback</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Part Name</label>
          <Input
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            placeholder="Enter part name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Material</label>
          <Input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Enter material type"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="accurate"
            checked={isAccurate}
            onCheckedChange={(checked) => setIsAccurate(checked as boolean)}
          />
          <label htmlFor="accurate" className="text-sm font-medium">
            Results are accurate
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="learning"
            checked={needsLearning}
            onCheckedChange={(checked) => setNeedsLearning(checked as boolean)}
          />
          <label htmlFor="learning" className="text-sm font-medium">
            Provide learning feedback
          </label>
        </div>

        {needsLearning && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Expected Results</label>
            <Textarea
              value={learningFeedback}
              onChange={(e) => setLearningFeedback(e.target.value)}
              placeholder="Please describe what results you expected..."
              className="min-h-[100px]"
            />
          </div>
        )}

        <Button onClick={handleSubmitFeedback} className="w-full">
          Submit Feedback
        </Button>
      </div>
    </Card>
  );
};