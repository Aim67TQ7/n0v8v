import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Branch } from "@/types/fishbone";

interface LearningFeedback {
  iteration: number;
  feedback: string;
}

export const useAnalysisState = () => {
  const { toast } = useToast();
  const [problemStatement, setProblemStatement] = useState("");
  const [currentIteration, setCurrentIteration] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [learningFeedback, setLearningFeedback] = useState<LearningFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [groupFeedback, setGroupFeedback] = useState<any[]>([]);

  const resetAnalysis = () => {
    setProblemStatement("");
    setCurrentIteration(0);
    setAnswers([]);
    setLearningFeedback([]);
    setAnalysis(null);
    setGroupFeedback([]);
    setBranches([]);
  };

  return {
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
    resetAnalysis,
  };
};