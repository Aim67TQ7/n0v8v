import { Lightbulb, PenLine, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const starters = [
  {
    icon: Lightbulb,
    text: "Brainstorm ideas for improving our production efficiency",
  },
  {
    icon: PenLine,
    text: "Help me write a safety procedure document",
  },
  {
    icon: HelpCircle,
    text: "Explain our quality control process",
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
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium mb-2">Quick Prompts</h3>
      {starters.map((starter) => {
        const Icon = starter.icon;
        return (
          <Card
            key={starter.text}
            className="p-2 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onSelect(starter.text)}
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