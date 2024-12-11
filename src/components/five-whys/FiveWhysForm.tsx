import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FiveWhysFormProps {
  onSubmit: (statement: string) => void;
}

export const FiveWhysForm = ({ onSubmit }: FiveWhysFormProps) => {
  const [problemStatement, setProblemStatement] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Start New Analysis</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Problem Statement</label>
        <Input
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Describe the problem you want to analyze..."
          className="w-full"
        />
      </div>
      <Button onClick={() => onSubmit(problemStatement)}>
        Start Analysis
      </Button>
    </div>
  );
};