import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FiveSEvaluationForm } from "@/components/FiveSEvaluationForm";
import { FiveSEvaluationResults } from "@/components/FiveSEvaluationResults";

const FiveSVision = () => {
  const [evaluationId, setEvaluationId] = useState<string | null>(null);

  const { data: evaluation, isLoading: isLoadingEvaluation } = useQuery({
    queryKey: ['evaluation', evaluationId],
    queryFn: async () => {
      if (!evaluationId) return null;
      const { data, error } = await supabase
        .from('five_s_evaluations')
        .select(`
          *,
          workcenter:workcenters(name),
          evaluation_images(image_url)
        `)
        .eq('id', evaluationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!evaluationId
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {!evaluationId ? (
        <FiveSEvaluationForm onEvaluationComplete={setEvaluationId} />
      ) : (
        <FiveSEvaluationResults
          evaluation={evaluation}
          onNewEvaluation={() => setEvaluationId(null)}
          isLoading={isLoadingEvaluation}
        />
      )}
    </div>
  );
};

export default FiveSVision;