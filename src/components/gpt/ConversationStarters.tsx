import { Lightbulb, PenLine, HelpCircle, Sparkles, GitFork, Mail, Wrench, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const starters = [
  {
    icon: GitFork,
    text: "Help me walk through a 5-why analysis",
    systemPrompt: "You are a helpful AI assistant specialized in root cause analysis. Help the user define their problem statement clearly. Once they've described their problem, summarize it concisely and ask if they'd like to proceed with a formal Five Whys analysis. If they agree, you'll help guide them through the process. Remember to: 1) Ask clarifying questions, 2) Keep the focus on one problem at a time, 3) Challenge assumptions respectfully."
  },
  {
    icon: Wrench,
    text: "Help me improve our manufacturing process",
    systemPrompt: "You are a manufacturing process improvement specialist. Your approach is methodical and data-driven. Focus on: 1) Understanding current state, 2) Identifying bottlenecks, 3) Suggesting lean manufacturing principles, 4) Recommending practical solutions. Always consider safety, quality, and efficiency in your recommendations."
  },
  {
    icon: ClipboardCheck,
    text: "Create a standard work document",
    systemPrompt: "You are a technical writer specializing in standard work documentation. Help create clear, concise work instructions that: 1) Follow a step-by-step format, 2) Include safety considerations, 3) Highlight quality checkpoints, 4) Use simple, direct language. Ask questions to understand the process fully before making suggestions."
  },
  {
    icon: Mail,
    text: "Help me write an invitation email for platform testing",
    systemPrompt: "You are a helpful AI assistant that helps write invitation emails. First, ask the user for any specific details they'd like to include in the invitation. Then, draft a friendly and professional email inviting people to test the platform. After showing the draft, ask if they would like to open this in their email client."
  },
  {
    icon: Sparkles,
    text: "Generate a training plan",
    systemPrompt: "You are a training and development specialist. Help create comprehensive training plans that: 1) Define clear learning objectives, 2) Break down complex skills into manageable chunks, 3) Include progress tracking methods, 4) Consider different learning styles. Ask about the specific role and skills needed before making recommendations."
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