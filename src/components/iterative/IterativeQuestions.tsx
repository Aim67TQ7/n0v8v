import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const answer = selectedOption === "custom" ? customAnswer : selectedOption;
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
        <div className="space-y-6">
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-4"
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">Other (specify)</Label>
            </div>
          </RadioGroup>

          {selectedOption === "custom" && (
            <Input
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder="Enter your own answer..."
              className="w-full mt-2"
            />
          )}

          <Button
            onClick={handleSubmit}
            disabled={(!selectedOption || (selectedOption === "custom" && !customAnswer.trim())) || isAnalyzing || loading}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Submit Reason'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};