import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GitFork } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { QuestioningInterface } from "@/components/five-whys/QuestioningInterface";
import { FishboneResult } from "@/components/five-whys/FishboneResult";

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

  const generateQuestions = async (context: string, iteration: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-five-whys', {
        body: {
          problemStatement: context,
          iteration,
          generateQuestions: true,
          previousAnswers: answers,
        },
      });

      if (error) throw error;
      return data.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
      return [];
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

      // Save the analysis with the correct type for learning_feedback
      const analysisData = {
        company_id: profile.company_id,
        created_by: session.user.id,
        problem_statement: problemStatement,
        selected_causes: allAnswers,
        fishbone_data: data.result,
        learning_feedback: learningFeedback.map(item => ({
          iteration: item.iteration,
          feedback: item.feedback
        }))
      };

      await supabase.from('five_whys_analysis').insert(analysisData);

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
      <div className="flex items-center gap-3 mb-8">
        <GitFork className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Five Whys Analysis</h1>
      </div>
      
      <Card className="p-6">
        {currentIteration === 0 ? (
          <FiveWhysForm onSubmit={startAnalysis} />
        ) : !analysis ? (
          <QuestioningInterface
            problemStatement={problemStatement}
            currentIteration={currentIteration}
            suggestedQuestions={[
              `Why ${currentIteration === 1 ? 'is' : 'did'} ${currentIteration === 1 ? problemStatement.toLowerCase() : answers[answers.length - 1].toLowerCase()}?`,
              `What caused ${currentIteration === 1 ? problemStatement.toLowerCase() : answers[answers.length - 1].toLowerCase()}?`,
              `What were the underlying factors that led to ${currentIteration === 1 ? problemStatement.toLowerCase() : answers[answers.length - 1].toLowerCase()}?`
            ]}
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