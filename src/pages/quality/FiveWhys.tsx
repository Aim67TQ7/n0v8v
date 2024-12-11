import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GitFork } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { FiveWhysForm } from "@/components/five-whys/FiveWhysForm";
import { CausesList } from "@/components/five-whys/CausesList";
import { FishboneResult } from "@/components/five-whys/FishboneResult";

interface Cause {
  id: string;
  text: string;
  checked: boolean;
}

const FiveWhys = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [problemStatement, setProblemStatement] = useState("");
  const [currentIteration, setCurrentIteration] = useState(0);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fishboneData, setFishboneData] = useState<any>(null);

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

      const fishboneData = data.result;
      setFishboneData(fishboneData);

      // Save the analysis
      await supabase.from('five_whys_analysis').insert({
        company_id: profile.company_id,
        created_by: session.user.id,
        problem_statement: problemStatement,
        selected_causes: allSelectedCauses,
        fishbone_data: fishboneData,
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

  const resetAnalysis = () => {
    setProblemStatement("");
    setCurrentIteration(0);
    setCauses([]);
    setSelectedCauses([]);
    setFishboneData(null);
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
        ) : !fishboneData ? (
          <CausesList
            causes={causes}
            onCauseToggle={handleCauseToggle}
            currentIteration={currentIteration}
            isAnalyzing={isAnalyzing}
            onNext={handleNext}
            onReset={resetAnalysis}
          />
        ) : (
          <FishboneResult
            fishboneData={fishboneData}
            onReset={resetAnalysis}
          />
        )}
      </Card>
    </div>
  );
};

export default FiveWhys;