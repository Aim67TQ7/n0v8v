import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface Cause {
  id: string;
  text: string;
  checked: boolean;
}

export const useFiveWhys = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [problemStatement, setProblemStatement] = useState("");
  const [currentIteration, setCurrentIteration] = useState(0);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

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
    await generateCauses();
  };

  const generateCauses = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-five-whys', {
        body: {
          problemStatement,
          selectedCauses,
          iteration: currentIteration,
          generateFishbone: false,
        },
      });

      if (error) throw error;

      const causesArray = data.result
        .split('\n')
        .filter(Boolean)
        .map((cause: string) => ({
          id: crypto.randomUUID(),
          text: cause.replace(/^\d+\.\s*/, ''),
          checked: false,
        }));

      setCauses(causesArray);
    } catch (error) {
      console.error('Error generating causes:', error);
      toast({
        title: "Error",
        description: "Failed to generate causes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCauseToggle = (causeId: string, checked: boolean) => {
    setCauses(prev => prev.map(cause => 
      cause.id === causeId ? { ...cause, checked } : cause
    ));
  };

  const generateFishbone = async (allSelectedCauses: string[]) => {
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
          selectedCauses: allSelectedCauses,
          generateFishbone: true,
        },
      });

      if (error) throw error;

      setAnalysis(data.result);

      // Save the analysis
      await supabase.from('five_whys_analysis').insert({
        company_id: profile.company_id,
        created_by: session.user.id,
        problem_statement: problemStatement,
        selected_causes: allSelectedCauses,
        fishbone_data: data.result,
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

  const handleNext = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    const newSelectedCauses = [
      ...selectedCauses,
      ...causes.filter(cause => cause.checked).map(cause => cause.text),
    ];
    setSelectedCauses(newSelectedCauses);

    if (currentIteration < 5) {
      setCurrentIteration(prev => prev + 1);
      await generateCauses();
    } else {
      await generateFishbone(newSelectedCauses);
    }
  };

  const resetAnalysis = () => {
    setProblemStatement("");
    setCurrentIteration(0);
    setCauses([]);
    setSelectedCauses([]);
    setAnalysis(null);
  };

  return {
    problemStatement,
    currentIteration,
    causes,
    isAnalyzing,
    analysis,
    startAnalysis,
    handleCauseToggle,
    handleNext,
    resetAnalysis,
  };
};