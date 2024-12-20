import { supabase } from "@/integrations/supabase/client";
import { Iteration } from "@/types/root-cause";
import { toast } from "sonner";

export const submitIteration = async (
  analysisId: string | undefined,
  stepNumber: number,
  whyQuestion: string,
  selectedAssumption: string
) => {
  const { error } = await supabase
    .from('root_cause_iterations')
    .insert({
      analysis_id: analysisId,
      iteration_number: stepNumber,
      why_question: whyQuestion,
      selected_assumption: selectedAssumption
    });

  if (error) throw error;
};

export const analyzeRootCause = async (
  currentStep: number,
  problemStatement: string,
  selectedAssumption: string,
  iterations: Iteration[]
) => {
  const { data, error } = await supabase.functions.invoke('analyze-root-cause', {
    body: {
      currentStep,
      problemStatement,
      selectedAssumption,
      iterationHistory: iterations
    }
  });

  if (error) throw error;

  return JSON.parse(data.content);
};