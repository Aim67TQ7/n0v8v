import { Lightbulb, PenLine, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {starters.map((starter) => {
        const Icon = starter.icon;
        return (
          <Button
            key={starter.text}
            variant="outline"
            className="h-auto p-4 flex flex-col gap-2 items-center text-center"
            onClick={() => onSelect(starter.text)}
          >
            <Icon className="h-6 w-6" />
            <span className="text-sm">{starter.text}</span>
          </Button>
        );
      })}
    </div>
  );
};