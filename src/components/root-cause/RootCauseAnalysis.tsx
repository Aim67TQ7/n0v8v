import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { analyzeRootCause, submitIteration } from "@/services/rootCauseService";
import { RootCauseState } from "@/types/root-cause";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { RootCauseForm } from "./RootCauseForm";
import { RootCauseHistory } from "./RootCauseHistory";

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

      setState(prev => ({
        ...prev,
        iterations: [...prev.iterations, {
          id: crypto.randomUUID(),
          whyQuestion: prev.whyQuestion,
          assumptions: prev.currentAssumptions,
          selectedAssumption: prev.userReason
        }],
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
          <RootCauseForm 
            state={state}
            onAnalyze={handleAnalyze}
            onStateChange={(newState) => setState(prev => ({ ...prev, ...newState }))}
          />
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

        <RootCauseHistory 
          iterations={state.iterations}
          onReset={handleReset}
          showReset={state.currentStep > 0 || state.iterations.length > 0}
        />
      </div>
    </Card>
  );
};