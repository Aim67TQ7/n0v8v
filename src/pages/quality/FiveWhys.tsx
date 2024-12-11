import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

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

  const startAnalysis = async () => {
    if (!problemStatement.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem statement",
        variant: "destructive",
      });
      return;
    }

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

      // Parse the AI response and create cause objects
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
    // Add selected causes to the list
    const newSelectedCauses = [
      ...selectedCauses,
      ...causes.filter(cause => cause.checked).map(cause => cause.text),
    ];
    setSelectedCauses(newSelectedCauses);

    if (currentIteration < 5) {
      setCurrentIteration(prev => prev + 1);
      await generateCauses();
    } else {
      // Generate fishbone diagram
      await generateFishbone(newSelectedCauses);
    }
  };

  const generateFishbone = async (allSelectedCauses: string[]) => {
    setIsAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No authenticated user");

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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Start New Analysis</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Statement</label>
              <Input
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Describe the problem you want to analyze..."
                className="w-full"
              />
            </div>
            <Button onClick={startAnalysis} disabled={isAnalyzing}>
              Start Analysis
            </Button>
          </div>
        ) : !fishboneData ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Iteration {currentIteration} of 5</h2>
              <Button variant="outline" onClick={resetAnalysis}>
                Start Over
              </Button>
            </div>
            <p className="text-muted-foreground">{problemStatement}</p>
            <div className="space-y-4">
              {causes.map((cause) => (
                <div key={cause.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={cause.id}
                    checked={cause.checked}
                    onCheckedChange={(checked) => handleCauseToggle(cause.id, checked as boolean)}
                  />
                  <label
                    htmlFor={cause.id}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cause.text}
                  </label>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleNext} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Processing..." : currentIteration === 5 ? "Generate Fishbone" : "Next"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <Button variant="outline" onClick={resetAnalysis}>
                New Analysis
              </Button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">
                {fishboneData}
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FiveWhys;