import { Lightbulb, PenLine, HelpCircle, Sparkles, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const starters = [
  {
    icon: GitFork,
    text: "Help me walk through a 5-why analysis",
    moduleRedirect: "/operations/quality/five-whys",
    requiresAnalysis: true
  },
  {
    icon: Lightbulb,
    text: "Brainstorm ideas for improving our production efficiency",
  },
  {
    icon: PenLine,
    text: "Help me write a safety procedure document",
  },
  {
    icon: Sparkles,
    text: "Generate a training plan for new employees",
  },
];

interface ConversationStartersProps {
  onSelect: (prompt: string) => void;
}

export const ConversationStarters = ({ onSelect }: ConversationStartersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStarterClick = async (starter: typeof starters[0]) => {
    onSelect(starter.text);

    if (starter.requiresAnalysis) {
      try {
        const response = await supabase.functions.invoke('chat-with-groq', {
          body: {
            messages: [
              { role: "system", content: "You are a helpful AI assistant specialized in process improvement and root cause analysis." },
              { role: "user", content: starter.text }
            ]
          },
        });

        if (response.error) throw response.error;

        const aiResponse = response.data.choices[0].message.content;
        
        // If this is a 5-why analysis prompt, navigate to the module
        if (starter.moduleRedirect === "/operations/quality/five-whys") {
          // Extract the core problem statement from the AI response
          const problemStatement = aiResponse.split('\n')[0]; // Take first line as summary
          
          // Navigate to Five Whys module with the problem statement
          navigate(starter.moduleRedirect, { 
            state: { problemStatement }
          });

          toast({
            title: "Analysis Started",
            description: "Redirecting you to the Five Whys module to begin your analysis.",
          });
        }
      } catch (error) {
        console.error('Error processing starter:', error);
        toast({
          title: "Error",
          description: "Failed to process your request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium mb-2">Quick Prompts</h3>
      {starters.map((starter) => {
        const Icon = starter.icon;
        return (
          <Card
            key={starter.text}
            className="p-2 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => handleStarterClick(starter)}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-xs">{starter.text}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};