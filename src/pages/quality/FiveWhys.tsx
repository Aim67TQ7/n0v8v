import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { QuestioningInterface } from "@/components/five-whys/QuestioningInterface";
import { FishboneResult } from "@/components/five-whys/FishboneResult";
import { AnalysisHeader } from "@/components/five-whys/AnalysisHeader";
import { CausesList } from "@/components/five-whys/CausesList";

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
  const [groupFeedback, setGroupFeedback] = useState<any[]>([]);

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
      await generateAnalysis(newAnswers);
    }
  };

  const generateAnalysis = async (allAnswers: string[]) => {
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
          generateAnalysis: true,
        },
      });

      if (error) throw error;

      setAnalysis(data.result);

      const transformedFeedback = learningFeedback.map(item => ({
        iteration: item.iteration,
        feedback: item.feedback
      }));

      await supabase.from('five_whys_analysis').insert({
        company_id: profile.company_id,
        created_by: session.user.id,
        problem_statement: problemStatement,
        selected_causes: allAnswers,
        fishbone_data: data.result,
        learning_feedback: transformedFeedback,
        root_cause: data.result.rootCause,
        immediate_actions: data.result.correctiveActions,
        long_term_actions: data.result.preventiveActions,
        group_feedback: groupFeedback
      });

      toast({
        title: "Analysis Complete",
        description: "Five Whys analysis has been completed and saved.",
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addGroupFeedback = async (feedback: string) => {
    if (!session?.user) return;
    
    const newFeedback = {
      userId: session.user.id,
      feedback,
      timestamp: new Date().toISOString()
    };
    
    setGroupFeedback([...groupFeedback, newFeedback]);
  };

  const resetAnalysis = () => {
    setProblemStatement("");
    setCurrentIteration(0);
    setAnswers([]);
    setLearningFeedback([]);
    setAnalysis(null);
    setGroupFeedback([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisHeader />
      <Card className="p-6">
        {currentIteration === 0 ? (
          <FiveWhysForm onSubmit={startAnalysis} />
        ) : !analysis ? (
          <>
            <QuestioningInterface
              problemStatement={problemStatement}
              currentIteration={currentIteration}
              previousAnswers={answers}
              onAnswer={handleAnswer}
              isAnalyzing={isAnalyzing}
            />
            <CausesList
              causes={answers.map((text, index) => ({
                id: `cause-${index}`,
                text,
                checked: true
              }))}
              currentIteration={currentIteration}
              isAnalyzing={isAnalyzing}
              onCauseToggle={() => {}}
              onNext={() => {}}
              onReset={resetAnalysis}
            />
          </>
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