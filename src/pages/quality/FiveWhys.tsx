import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GitFork } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { QuestioningInterface } from "@/components/five-whys/QuestioningInterface";
import { FishboneResult } from "@/components/five-whys/FishboneResult";
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
    
    // Generate contextual questions based on the iteration and previous answers
    let questions;
    
    switch (iteration) {
      case 1:
        questions = [
          `${lastAnswer} because of process/procedure issues`,
          `${lastAnswer} because of equipment/tool problems`,
          `${lastAnswer} because of training/knowledge gaps`
        ];
        break;
      case 2:
        questions = [
          `${lastAnswer} because standard procedures weren't followed`,
          `${lastAnswer} because procedures weren't clear`,
          `${lastAnswer} because procedures weren't available`
        ];
        break;
      case 3:
        questions = [
          `${lastAnswer} because of insufficient oversight`,
          `${lastAnswer} because of communication breakdown`,
          `${lastAnswer} because of resource constraints`
        ];
        break;
      case 4:
        questions = [
          `${lastAnswer} because of systemic issues`,
          `${lastAnswer} because of organizational barriers`,
          `${lastAnswer} because of policy limitations`
        ];
        break;
      case 5:
        questions = [
          `${lastAnswer} because of missing standardization`,
          `${lastAnswer} because of inadequate controls`,
          `${lastAnswer} because of cultural factors`
        ];
        break;
      default:
        questions = [
          `${lastAnswer} because of process issues`,
          `${lastAnswer} because of system issues`,
          `${lastAnswer} because of human factors`
        ];
    }
    
    return questions;
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

      // Transform learning feedback to match Json type
      const transformedFeedback: Json[] = learningFeedback.map(item => ({
        iteration: item.iteration,
        feedback: item.feedback
      }));

      const analysisData = {
        company_id: profile.company_id,
        created_by: session.user.id,
        problem_statement: problemStatement,
        selected_causes: allAnswers,
        fishbone_data: data.result,
        learning_feedback: transformedFeedback
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