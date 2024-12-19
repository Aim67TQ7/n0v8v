import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BranchTree } from "./branches/BranchTree";
import type { Branch } from "@/types/fishbone";

interface QuestioningInterfaceProps {
  problemStatement: string;
  currentIteration: number;
  previousAnswers: string[];
  onAnswer: (answer: string, feedback?: string) => void;
  isAnalyzing: boolean;
  branches?: Branch[];
  onAddBranch?: (parentId: string, text: string) => void;
}

export const QuestioningInterface = ({
  problemStatement,
  currentIteration,
  previousAnswers,
  onAnswer,
  isAnalyzing,
  branches = [],
  onAddBranch = () => {},
}: QuestioningInterfaceProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [learningFeedback, setLearningFeedback] = useState("");
  const [isLearning, setIsLearning] = useState(false);

  const handleAnswerToggle = (answer: string, checked: boolean) => {
    if (checked) {
      setSelectedAnswers(prev => [...prev, answer]);
    } else {
      setSelectedAnswers(prev => prev.filter(a => a !== answer));
    }
  };

  const handleSubmit = () => {
    const answers = [...selectedAnswers];
    if (customAnswer.trim()) {
      answers.push(customAnswer);
    }
    
    const combinedAnswer = answers.join(" AND ");
    onAnswer(combinedAnswer, isLearning ? learningFeedback : undefined);
    
    setSelectedAnswers([]);
    setCustomAnswer("");
    setLearningFeedback("");
    setIsLearning(false);
  };

  const getIterationHeader = () => {
    switch (currentIteration) {
      case 1:
        return "Initial Cause Identification";
      case 2:
        return "Process Analysis";
      case 3:
        return "System Evaluation";
      case 4:
        return "Organizational Factors";
      case 5:
        return "Root Cause Discovery";
      default:
        return `Why #${currentIteration}`;
    }
  };

  const suggestedQuestions = previousAnswers.length > 0 
    ? [`Why did ${previousAnswers[previousAnswers.length - 1].toLowerCase()}?`]
    : ["What is the immediate cause?", "What factors contributed to this?"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{getIterationHeader()}</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="learning"
            checked={isLearning}
            onCheckedChange={(checked) => setIsLearning(checked as boolean)}
          />
          <label htmlFor="learning" className="text-sm">Add Learning Note</label>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-lg">
          {currentIteration === 1 
            ? `Why is ${problemStatement.toLowerCase()}?`
            : "Why did this happen?"}
        </p>
        
        <div className="space-y-3">
          {suggestedQuestions.map((question, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Checkbox
                id={`answer-${index}`}
                checked={selectedAnswers.includes(question)}
                onCheckedChange={(checked) => handleAnswerToggle(question, checked as boolean)}
              />
              <label
                htmlFor={`answer-${index}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {question}
              </label>
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom-answer"
                checked={customAnswer.trim() !== ""}
                onCheckedChange={(checked) => {
                  if (!checked) setCustomAnswer("");
                }}
              />
              <label htmlFor="custom-answer" className="text-sm">Custom Answer</label>
            </div>
            <Input
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder="Enter your own answer..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {branches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Alternative Branches</h3>
          <BranchTree branches={branches} onAddBranch={onAddBranch} />
        </div>
      )}

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
        disabled={selectedAnswers.length === 0 && !customAnswer.trim() || isAnalyzing}
        className="w-full relative overflow-hidden"
      >
        {isAnalyzing ? "Processing..." : "Next"}
        {isAnalyzing && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="loading-bar" />
          </div>
        )}
      </Button>
    </div>
  );
};