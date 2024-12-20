import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RootCauseState } from "@/types/root-cause";

interface RootCauseFormProps {
  state: RootCauseState;
  onAnalyze: () => Promise<void>;
  onStateChange: (newState: Partial<RootCauseState>) => void;
}

export const RootCauseForm = ({ state, onAnalyze, onStateChange }: RootCauseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!state.problemStatement.trim()) {
      toast.error("Please enter a problem statement");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAnalyze();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Problem Statement</h2>
      <Textarea
        value={state.problemStatement}
        onChange={(e) => onStateChange({ problemStatement: e.target.value })}
        placeholder="Describe the problem you're facing..."
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting || !state.problemStatement.trim()}
      >
        {isSubmitting ? "Analyzing..." : "Start Analysis"}
      </Button>
    </div>
  );
};