import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Iteration {
  whyQuestion: string;
  assumptions: string[];
  selectedAssumption: string;
}

export const RootCauseAnalysis = () => {
  const [problemStatement, setProblemStatement] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [currentAssumptions, setCurrentAssumptions] = useState<string[]>([]);
  const [selectedAssumption, setSelectedAssumption] = useState<string>("");
  const [whyQuestion, setWhyQuestion] = useState<string>("");
  const [rephrasedProblem, setRephrasedProblem] = useState<string>("");

  const handleAnalyze = async () => {
    if (!problemStatement.trim()) {
      toast.error("Please enter a problem statement");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-root-cause', {
        body: {
          currentStep,
          problemStatement,
          selectedAssumption,
          iterationHistory: iterations
        }
      });

      if (error) throw error;

      // Parse the JSON response from GPT
      const gptResponse = JSON.parse(data.content);
      
      if (currentStep === 0) {
        setRephrasedProblem(gptResponse.rephrased);
      }
      
      setWhyQuestion(gptResponse.whyQuestion);
      setCurrentAssumptions(gptResponse.assumptions);
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze the problem");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAssumptionSelect = async (assumption: string) => {
    const newIteration: Iteration = {
      whyQuestion,
      assumptions: currentAssumptions,
      selectedAssumption: assumption
    };

    setIterations([...iterations, newIteration]);
    setSelectedAssumption(assumption);
    setCurrentStep(prev => prev + 1);

    if (currentStep < 4) {
      // Proceed to next iteration
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('analyze-root-cause', {
          body: {
            currentStep: currentStep + 1,
            problemStatement,
            selectedAssumption: assumption,
            iterationHistory: [...iterations, newIteration]
          }
        });

        if (error) throw error;

        const gptResponse = JSON.parse(data.content);
        setWhyQuestion(gptResponse.whyQuestion);
        setCurrentAssumptions(gptResponse.assumptions);
      } catch (error) {
        console.error('Analysis error:', error);
        toast.error("Failed to proceed with analysis");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Final step reached
      toast.success("Root cause analysis complete!");
    }
  };

  const handleReset = () => {
    setProblemStatement("");
    setCurrentStep(0);
    setIterations([]);
    setCurrentAssumptions([]);
    setSelectedAssumption("");
    setWhyQuestion("");
    setRephrasedProblem("");
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        {currentStep === 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Problem Statement</h2>
            <Textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Describe the problem you're facing..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !problemStatement.trim()}
            >
              {isAnalyzing ? "Analyzing..." : "Start Analysis"}
            </Button>
          </div>
        ) : null}

        {rephrasedProblem && (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Rephrased Problem:</h3>
            <p>{rephrasedProblem}</p>
          </div>
        )}

        {whyQuestion && (
          <div className="space-y-4">
            <h3 className="font-medium">{whyQuestion}</h3>
            <RadioGroup
              value={selectedAssumption}
              onValueChange={handleAssumptionSelect}
              className="space-y-3"
            >
              {currentAssumptions.map((assumption, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={assumption} id={`assumption-${index}`} />
                  <Label htmlFor={`assumption-${index}`}>{assumption}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {iterations.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Analysis History:</h3>
            <div className="space-y-3">
              {iterations.map((iteration, index) => (
                <div key={index} className="bg-muted p-3 rounded-lg">
                  <p className="font-medium">{iteration.whyQuestion}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {iteration.selectedAssumption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentStep > 0 || iterations.length > 0) && (
          <Button variant="outline" onClick={handleReset}>
            Start New Analysis
          </Button>
        )}
      </div>
    </Card>
  );
};