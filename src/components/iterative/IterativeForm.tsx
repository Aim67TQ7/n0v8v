import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface IterativeFormProps {
  onSubmit: (statement: string) => void;
}

export const IterativeForm = ({ onSubmit }: IterativeFormProps) => {
  const [statement, setStatement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (statement.trim()) {
      onSubmit(statement.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Provide a clear and detailed description of the problem you want to analyze.
            Be specific and include relevant context.
          </AlertDescription>
        </Alert>
        <Textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Describe the problem..."
          className="min-h-[150px]"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!statement.trim()}
        className="w-full"
      >
        Start Analysis
      </Button>
    </form>
  );
};