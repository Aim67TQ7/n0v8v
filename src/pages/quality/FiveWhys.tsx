import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { QuestioningInterface } from "@/components/five-whys/QuestioningInterface";
import { FishboneResult } from "@/components/five-whys/FishboneResult";
import { AnalysisHeader } from "@/components/five-whys/AnalysisHeader";
import { useAnalysisState } from "@/components/five-whys/hooks/useAnalysisState";
import { generateAnalysis, addBranch } from "@/components/five-whys/services/analysisService";
import { supabase } from "@/integrations/supabase/client";

const FiveWhys = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const {
    problemStatement,
    setProblemStatement,
    currentIteration,
    setCurrentIteration,
    answers,
    setAnswers,
    learningFeedback,
    setLearningFeedback,
    isAnalyzing,
    setIsAnalyzing,
    analysis,
    setAnalysis,
    branches,
    setBranches,
    groupFeedback,
    setGroupFeedback,
    resetAnalysis
  } = useAnalysisState();

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

  const handleAddBranch = async (parentId: string, text: string) => {
    if (!session?.user) return;

    try {
      await addBranch(
        parentId,
        text,
        currentIteration,
        analysis?.id,
        session.user.id,
        branches,
        setBranches
      );

      toast({
        title: "Branch added",
        description: "New cause branch has been added successfully."
      });
    } catch (error) {
      console.error('Error adding branch:', error);
      toast({
        title: "Error",
        description: "Failed to add new branch",
        variant: "destructive"
      });
    }
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
      try {
        setIsAnalyzing(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .single();

        if (!profile?.company_id) throw new Error("No company ID found");

        const result = await generateAnalysis(
          problemStatement,
          newAnswers,
          learningFeedback,
          profile.company_id,
          session.user.id,
          groupFeedback
        );

        setAnalysis(result);
        
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
    }
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
            previousAnswers={answers}
            onAnswer={handleAnswer}
            isAnalyzing={isAnalyzing}
            branches={branches}
            onAddBranch={handleAddBranch}
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