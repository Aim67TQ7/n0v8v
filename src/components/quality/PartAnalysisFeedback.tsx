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
  predictedPartName?: string;
  predictedMaterial?: string;
}

export const PartAnalysisFeedback = ({ 
  inspectionId, 
  predictedPartName,
  predictedMaterial 
}: PartAnalysisFeedbackProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [partName, setPartName] = useState(predictedPartName || "");
  const [material, setMaterial] = useState(predictedMaterial || "");
  const [isPartNameAccurate, setIsPartNameAccurate] = useState(true);
  const [isMaterialAccurate, setIsMaterialAccurate] = useState(true);
  const [isAccurate, setIsAccurate] = useState(true);
  const [needsLearning, setNeedsLearning] = useState(false);
  const [learningFeedback, setLearningFeedback] = useState("");

  const handleSubmitFeedback = async () => {
    try {
      const { error } = await supabase.from('part_inspection_feedback').insert({
        inspection_id: inspectionId,
        part_name: partName,
        material: material,
        part_name_accurate: isPartNameAccurate,
        material_accurate: isMaterialAccurate,
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Part Name</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="partNameAccurate"
                checked={isPartNameAccurate}
                onCheckedChange={(checked) => setIsPartNameAccurate(checked as boolean)}
              />
              <label htmlFor="partNameAccurate" className="text-sm">
                Prediction is accurate
              </label>
            </div>
          </div>
          <Input
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            placeholder={predictedPartName || "Enter part name"}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Material</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="materialAccurate"
                checked={isMaterialAccurate}
                onCheckedChange={(checked) => setIsMaterialAccurate(checked as boolean)}
              />
              <label htmlFor="materialAccurate" className="text-sm">
                Prediction is accurate
              </label>
            </div>
          </div>
          <Input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={predictedMaterial || "Enter material type"}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="accurate"
            checked={isAccurate}
            onCheckedChange={(checked) => setIsAccurate(checked as boolean)}
          />
          <label htmlFor="accurate" className="text-sm font-medium">
            Analysis results are accurate
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
            <label className="text-sm font-medium">Learning Feedback</label>
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