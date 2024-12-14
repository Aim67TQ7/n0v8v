import { Card } from "@/components/ui/card";
import { Mail, FileText, Lightbulb, MessageSquare } from "lucide-react";

interface QuickPromptProps {
  onPromptSelect: (prompt: string) => void;
}

export const QuickPrompts = ({ onPromptSelect }: QuickPromptProps) => {
  const prompts = [
    {
      title: "Help write an email",
      icon: <Mail className="h-5 w-5" />,
      prompt: "I need help writing a professional email about: "
    },
    {
      title: "Create Documentation",
      icon: <FileText className="h-5 w-5" />,
      prompt: "Help me create a detailed SOP/work instruction for: "
    },
    {
      title: "Let's brainstorm",
      icon: <Lightbulb className="h-5 w-5" />,
      prompt: "I want to brainstorm ideas about: "
    },
    {
      title: "Help write a prompt",
      icon: <MessageSquare className="h-5 w-5" />,
      prompt: "I need help writing an effective prompt for: "
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {prompts.map((item) => (
        <Card
          key={item.title}
          className="p-4 hover:bg-accent cursor-pointer transition-colors"
          onClick={() => onPromptSelect(item.prompt)}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};