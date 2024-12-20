import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { analyzeRootCause, submitIteration } from "@/services/rootCauseService";
import { Iteration, RootCauseState } from "@/types/root-cause";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

export const RootCauseAnalysis = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const [state, setState] = useState<RootCauseState>({
    problemStatement: "",
    userReason: "",
    currentStep: 0,
    isAnalyzing: false,
    iterations: [],
    currentAssumptions: [],
    selectedAssumption: "",
    whyQuestion: "",
    rephrasedProblem: ""
  });

  // Check authentication
  if (!session) {
    navigate("/login");
    return null;
  }

  const handleAnalyze = async () => {
    if (!state.problemStatement.trim()) {
      toast.error("Please enter a problem statement");
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const gptResponse = await analyzeRootCause(
        state.currentStep,
        state.problemStatement,
        state.selectedAssumption,
        state.iterations
      );
      
      setState(prev => ({
        ...prev,
        rephrasedProblem: state.currentStep === 0 ? gptResponse.rephrased : prev.rephrasedProblem,
        whyQuestion: gptResponse.whyQuestion,
        currentAssumptions: gptResponse.assumptions
      }));
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze the problem");
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleSubmit = async () => {
    if (!state.userReason.trim()) {
      toast.error("Please enter your reason");
      return;
    }

    try {
      await submitIteration(
        state.iterations[0]?.id,
        state.currentStep + 1,
        state.whyQuestion,
        state.userReason
      );

      const newIteration: Iteration = {
        whyQuestion: state.whyQuestion,
        assumptions: state.currentAssumptions,
        selectedAssumption: state.userReason
      };

      setState(prev => ({
        ...prev,
        iterations: [...prev.iterations, newIteration],
        userReason: "",
        currentStep: prev.currentStep + 1
      }));

      if (state.currentStep < 4) {
        await handleAnalyze();
      } else {
        toast.success("Root cause analysis complete!");
      }
    } catch (error) {
      console.error('Error submitting reason:', error);
      toast.error("Failed to submit reason");
    }
  };

  const handleReset = () => {
    setState({
      problemStatement: "",
      userReason: "",
      currentStep: 0,
      isAnalyzing: false,
      iterations: [],
      currentAssumptions: [],
      selectedAssumption: "",
      whyQuestion: "",
      rephrasedProblem: ""
    });
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        {state.currentStep === 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Problem Statement</h2>
            <Textarea
              value={state.problemStatement}
              onChange={(e) => setState(prev => ({ ...prev, problemStatement: e.target.value }))}
              placeholder="Describe the problem you're facing..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={state.isAnalyzing || !state.problemStatement.trim()}
            >
              {state.isAnalyzing ? "Analyzing..." : "Start Analysis"}
            </Button>
          </div>
        ) : null}

        {state.rephrasedProblem && (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Rephrased Problem:</h3>
            <p>{state.rephrasedProblem}</p>
          </div>
        )}

        {state.whyQuestion && (
          <div className="space-y-4">
            <h3 className="font-medium">{state.whyQuestion}</h3>
            
            <div className="space-y-4">
              <Label htmlFor="user-reason">Your Reason</Label>
              <Textarea
                id="user-reason"
                value={state.userReason}
                onChange={(e) => setState(prev => ({ ...prev, userReason: e.target.value }))}
                placeholder="Enter your reason..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSubmit}
                disabled={!state.userReason.trim() || state.isAnalyzing}
              >
                Submit Reason
              </Button>
            </div>

            <RadioGroup
              value={state.selectedAssumption}
              onValueChange={(value) => setState(prev => ({ ...prev, selectedAssumption: value }))}
              className="space-y-3"
            >
              {state.currentAssumptions.map((assumption, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={assumption} id={`assumption-${index}`} />
                  <Label htmlFor={`assumption-${index}`}>{assumption}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {state.iterations.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Analysis History:</h3>
            <div className="space-y-3">
              {state.iterations.map((iteration, index) => (
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

        {(state.currentStep > 0 || state.iterations.length > 0) && (
          <Button variant="outline" onClick={handleReset}>
            Start New Analysis
          </Button>
        )}
      </div>
    </Card>
  );
};