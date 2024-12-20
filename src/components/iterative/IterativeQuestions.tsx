import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IterativeQuestionsProps {
  problemStatement: string;
  currentIteration: number;
  previousAnswers: string[];
  onAnswer: (answer: string) => void;
  isAnalyzing: boolean;
}

export const IterativeQuestions = ({
  problemStatement,
  currentIteration,
  previousAnswers,
  onAnswer,
  isAnalyzing
}: IterativeQuestionsProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('analyze-iterative', {
          body: {
            problemStatement,
            currentIteration,
            previousAnswers
          }
        });

        if (error) throw error;
        setOptions(data.options || []);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error("Failed to generate options");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [currentIteration]);

  const handleSubmit = () => {
    const answer = selectedOption || customAnswer;
    if (answer.trim()) {
      onAnswer(answer.trim());
      setSelectedOption("");
      setCustomAnswer("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {currentIteration === 1 
            ? `Why is "${problemStatement}"?`
            : `Why ${previousAnswers[previousAnswers.length - 1]}?`}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Iteration {currentIteration} of 5
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Checkbox
                id={`option-${index}`}
                checked={selectedOption === option}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedOption(option);
                    setCustomAnswer("");
                  } else {
                    setSelectedOption("");
                  }
                }}
              />
              <label
                htmlFor={`option-${index}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom"
                checked={customAnswer.trim() !== ""}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    setCustomAnswer("");
                  }
                  setSelectedOption("");
                }}
              />
              <label htmlFor="custom" className="text-sm">Custom Answer</label>
            </div>
            <Input
              value={customAnswer}
              onChange={(e) => {
                setCustomAnswer(e.target.value);
                setSelectedOption("");
              }}
              placeholder="Enter your own answer..."
              className="w-full"
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={(!selectedOption && !customAnswer.trim()) || isAnalyzing || loading}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Next'
        )}
      </Button>
    </div>
  );
};