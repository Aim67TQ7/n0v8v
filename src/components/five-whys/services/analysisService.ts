import { supabase } from "@/integrations/supabase/client";
import type { Branch } from "@/types/fishbone";

export const generateAnalysis = async (
  problemStatement: string,
  allAnswers: string[],
  learningFeedback: { iteration: number; feedback: string }[],
  companyId: string,
  userId: string,
  groupFeedback: any[]
) => {
  const { data, error } = await supabase.functions.invoke('analyze-five-whys', {
    body: {
      problemStatement,
      answers: allAnswers,
      generateAnalysis: true,
    },
  });

  if (error) throw error;

  const transformedFeedback = learningFeedback.map(item => ({
    iteration: item.iteration,
    feedback: item.feedback
  }));

  await supabase.from('five_whys_analysis').insert({
    company_id: companyId,
    created_by: userId,
    problem_statement: problemStatement,
    selected_causes: allAnswers,
    fishbone_data: data.result,
    learning_feedback: transformedFeedback,
    root_cause: data.result.rootCause,
    immediate_actions: data.result.correctiveActions,
    long_term_actions: data.result.preventiveActions,
    group_feedback: groupFeedback
  });

  return data.result;
};

export const addBranch = async (
  parentId: string,
  text: string,
  currentIteration: number,
  analysisId: string | undefined,
  userId: string,
  branches: Branch[],
  setBranches: (branches: Branch[]) => void
) => {
  const newBranch: Branch = {
    id: crypto.randomUUID(),
    text,
    parentId,
    iteration: currentIteration,
    children: []
  };

  const { error } = await supabase
    .from('five_whys_branches')
    .insert({
      analysis_id: analysisId,
      parent_cause_id: parentId,
      cause_text: text,
      iteration_number: currentIteration,
      created_by: userId
    });

  if (error) throw error;

  setBranches(prev => {
    const updateBranches = (items: Branch[]): Branch[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newBranch]
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateBranches(item.children)
          };
        }
        return item;
      });
    };

    if (parentId) {
      return updateBranches(prev);
    }
    return [...prev, newBranch];
  });

  return newBranch;
};