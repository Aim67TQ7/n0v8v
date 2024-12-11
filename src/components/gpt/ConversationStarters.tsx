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
    systemPrompt: "You are a helpful AI assistant specialized in root cause analysis. Help the user define their problem statement clearly. Once they've described their problem, summarize it concisely and ask if they'd like to proceed with a formal Five Whys analysis. If they agree, you'll help guide them through the process."
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
  onSelect: (prompt: string, systemPrompt?: string) => void;
}

export const ConversationStarters = ({ onSelect }: ConversationStartersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStarterClick = (starter: typeof starters[0]) => {
    onSelect(starter.text, starter.systemPrompt);
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