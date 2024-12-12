import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { QuestioningInterface } from "@/components/five-whys/QuestioningInterface";
import { FishboneResult } from "@/components/five-whys/FishboneResult";
import { AnalysisHeader } from "@/components/five-whys/AnalysisHeader";
import { Json } from "@/integrations/supabase/types";

interface LearningFeedback {
  iteration: number;
  feedback: string;
}

const FiveWhys = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [problemStatement, setProblemStatement] = useState("");
  const [currentIteration, setCurrentIteration] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [learningFeedback, setLearningFeedback] = useState<LearningFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const generateSequentialQuestions = (context: string, iteration: number, previousAnswers: string[]) => {
    const lastAnswer = previousAnswers[previousAnswers.length - 1] || context;
    
    const baseQuestions = [
      "Process/Procedure Issues",
      "Equipment/Tool Problems",
      "Training/Knowledge Gaps",
      "Communication Breakdown",
      "Resource Constraints"
    ];
    
    switch (iteration) {
      case 1:
        return baseQuestions.map(q => `${lastAnswer} due to ${q.toLowerCase()}`);
      case 2:
        return [
          "Standard procedures weren't followed",
          "Procedures weren't clear",
          "Required resources unavailable",
          "Inadequate training provided",
          "Communication channels ineffective"
        ];
      case 3:
        return [
          "Lack of oversight mechanisms",
          "Insufficient quality controls",
          "Inadequate process documentation",
          "Missing standardization",
          "Incomplete risk assessment"
        ];
      case 4:
        return [
          "Organizational barriers present",
          "Resource allocation issues",
          "Policy limitations exist",
          "Cultural factors impact work",
          "Management support lacking"
        ];
      case 5:
        return [
          "Systemic process gaps",
          "Organizational structure issues",
          "Policy framework inadequate",
          "Cultural transformation needed",
          "Strategic alignment missing"
        ];
      default:
        return baseQuestions;
    }
  };

  const startAnalysis = async (statement: string) => {
    if (!statement.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem statement",
        variant: "destructive",
      });
      return;
    }

    setProblemStatement(statement);
    setCurrentIteration(1);
  };

  const handleAnswer = async (answer: string, feedback?: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (feedback) {
      setLearningFeedback([
        ...learningFeedback,
        { iteration: currentIteration, feedback }
      ]);
    }

    if (currentIteration < 5) {
      setCurrentIteration(prev => prev + 1);
    } else {
      await generateFishbone(newAnswers);
    }
  };

  const generateFishbone = async (allAnswers: string[]) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.company_id) throw new Error("No company ID found");

      const { data, error } = await supabase.functions.invoke('analyze-five-whys', {
        body: {
          problemStatement,
          answers: allAnswers,
          generateFishbone: true,
        },
      });

      if (error) throw error;

      setAnalysis(data.result);

      const transformedFeedback: Json[] = learningFeedback.map(item => ({
        iteration: item.iteration,
        feedback: item.feedback
      }));

      await supabase.from('five_whys_analysis').insert({
        company_id: profile.company_id,
        created_by: session.user.id,
        problem_statement: problemStatement,
        selected_causes: allAnswers,
        fishbone_data: data.result,
        learning_feedback: transformedFeedback
      });

      toast({
        title: "Analysis Complete",
        description: "Five Whys analysis has been completed and saved.",
      });
    } catch (error) {
      console.error('Error generating fishbone:', error);
      toast({
        title: "Error",
        description: "Failed to generate fishbone diagram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setProblemStatement("");
    setCurrentIteration(0);
    setAnswers([]);
    setLearningFeedback([]);
    setAnalysis(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisHeader />
      <Card className="p-6">
        {currentIteration === 0 ? (
          <FiveWhysForm onSubmit={startAnalysis} />
        ) : !analysis ? (
          <QuestioningInterface
            problemStatement={problemStatement}
            currentIteration={currentIteration}
            suggestedQuestions={generateSequentialQuestions(problemStatement, currentIteration, answers)}
            onAnswer={handleAnswer}
          />
        ) : (
          <FishboneResult
            analysis={analysis}
            onReset={resetAnalysis}
          />
        )}
      </Card>
    </div>
  );
};

export default FiveWhys;