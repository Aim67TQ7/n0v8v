import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface QuestioningInterfaceProps {
  problemStatement: string;
  currentIteration: number;
  suggestedQuestions: string[];
  onAnswer: (answer: string, feedback?: string) => void;
}

export const QuestioningInterface = ({
  problemStatement,
  currentIteration,
  suggestedQuestions,
  onAnswer,
}: QuestioningInterfaceProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [learningFeedback, setLearningFeedback] = useState("");
  const [isLearning, setIsLearning] = useState(false);

  const handleSubmit = () => {
    onAnswer(selectedQuestion, isLearning ? learningFeedback : undefined);
    setSelectedQuestion("");
    setLearningFeedback("");
    setIsLearning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Why #{currentIteration}</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="learning"
            checked={isLearning}
            onCheckedChange={(checked) => setIsLearning(checked as boolean)}
          />
          <label htmlFor="learning" className="text-sm">Add Learning Note</label>
        </div>
      </div>

      <Card className="p-4">
        <p className="font-medium mb-2">Previous Statement:</p>
        <p className="text-sm bg-muted p-2 rounded">
          {currentIteration === 1 ? problemStatement : "Previous answer goes here"}
        </p>
      </Card>

      <div className="space-y-4">
        {suggestedQuestions.map((question, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Checkbox
              id={`question-${index}`}
              checked={selectedQuestion === question}
              onCheckedChange={(checked) => {
                if (checked) setSelectedQuestion(question);
              }}
            />
            <label
              htmlFor={`question-${index}`}
              className="text-sm"
            >
              {question}
            </label>
          </div>
        ))}
      </div>

      {isLearning && (
        <Textarea
          placeholder="Add your learning notes here..."
          value={learningFeedback}
          onChange={(e) => setLearningFeedback(e.target.value)}
          className="min-h-[100px]"
        />
      )}

      <Button 
        onClick={handleSubmit}
        disabled={!selectedQuestion || (isLearning && !learningFeedback)}
        className="w-full"
      >
        Next
      </Button>
    </div>
  );
};