import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FishboneForm } from "@/components/fishbone/FishboneForm";
import { FishboneResults } from "@/components/fishbone/FishboneResults";
import { FishboneHeader } from "@/components/fishbone/FishboneHeader";

const Fishbone = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [problemStatement, setProblemStatement] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const startAnalysis = async (statement: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProblemStatement(statement);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.company_id) throw new Error("No company ID found");

      const { data, error } = await supabase.functions.invoke('analyze-fishbone', {
        body: { problemStatement: statement }
      });

      if (error) throw error;

      setAnalysis(data.result);

      toast({
        title: "Analysis Complete",
        description: "Fishbone analysis has been completed.",
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

  const resetAnalysis = () => {
    setProblemStatement("");
    setAnalysis(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FishboneHeader />
      <Card className="p-6">
        {!analysis ? (
          <FishboneForm onSubmit={startAnalysis} />
        ) : (
          <FishboneResults
            analysis={analysis}
            onReset={resetAnalysis}
          />
        )}
      </Card>
    </div>
  );
};

export default Fishbone;