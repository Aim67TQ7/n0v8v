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
    <div className="w-full max-w-3xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">How can I help you today?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {starters.map((starter) => {
          const Icon = starter.icon;
          return (
            <Card
              key={starter.text}
              className="p-4 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => onSelect(starter.text)}
            >
              <div className="flex flex-col items-center gap-3">
                <Icon className="h-6 w-6" />
                <span className="text-sm text-center">{starter.text}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};