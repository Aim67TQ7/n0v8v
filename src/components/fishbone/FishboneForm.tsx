import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FishboneFormProps {
  onSubmit: (statement: string) => void;
}

export const FishboneForm = ({ onSubmit }: FishboneFormProps) => {
  const [problemStatement, setProblemStatement] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Start New Analysis</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Problem Statement</label>
        <Textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Describe the problem you want to analyze..."
          className="min-h-[100px]"
        />
      </div>
      <Button 
        onClick={() => onSubmit(problemStatement)}
        disabled={!problemStatement.trim()}
      >
        Start Analysis
      </Button>
    </div>
  );
};