import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { IterativeForm } from "@/components/iterative/IterativeForm";
import { IterativeQuestions } from "@/components/iterative/IterativeQuestions";
import { IterativeResults } from "@/components/iterative/IterativeResults";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IterativeAnalysis = () => {
  const { user } = useAuth();
  const [problemStatement, setProblemStatement] = useState("");
  const [currentIteration, setCurrentIteration] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<{
    rootCause: string;
    solutions: { title: string; steps: string[] }[];
    followUpPlan: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStart = (statement: string) => {
    setProblemStatement(statement);
    setCurrentIteration(1);
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIteration >= 5 || answer.toLowerCase().includes("root cause")) {
      try {
        setIsAnalyzing(true);
        
        // Save analysis to database
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user?.id)
          .single();

        if (!profile?.company_id) throw new Error("No company ID found");

        const { data, error } = await supabase
          .from('iterative_analysis')
          .insert({
            company_id: profile.company_id,
            created_by: user?.id,
            problem_statement: problemStatement,
            selected_options: newAnswers,
            status: 'completed',
            root_cause: answer,
            solutions: {
              immediate: ["Document findings", "Share with team"],
              longTerm: ["Monitor implementation", "Review effectiveness"]
            },
            follow_up_plan: "Schedule weekly reviews to track progress"
          })
          .select()
          .single();

        if (error) throw error;

        setAnalysis({
          rootCause: answer,
          solutions: [
            {
              title: "Immediate Actions",
              steps: ["Document findings", "Share with team"]
            },
            {
              title: "Long-term Solutions",
              steps: ["Monitor implementation", "Review effectiveness"]
            }
          ],
          followUpPlan: "Schedule weekly reviews to track progress"
        });

        toast.success("Analysis completed successfully");
      } catch (error) {
        console.error('Error saving analysis:', error);
        toast.error("Failed to save analysis");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setCurrentIteration(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setProblemStatement("");
    setCurrentIteration(0);
    setAnswers([]);
    setAnalysis(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <GitBranch className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Iterative Analysis</h1>
      </div>

      <Card className="p-6">
        {currentIteration === 0 ? (
          <IterativeForm onSubmit={handleStart} />
        ) : !analysis ? (
          <IterativeQuestions
            problemStatement={problemStatement}
            currentIteration={currentIteration}
            previousAnswers={answers}
            onAnswer={handleAnswer}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <IterativeResults
            analysis={analysis}
            onReset={handleReset}
          />
        )}
      </Card>
    </div>
  );
};

export default IterativeAnalysis;