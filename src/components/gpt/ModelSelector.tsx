import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (value: string) => void;
}

interface AiPersonality {
  id: string;
  name: string;
  description: string;
  provider: string;
}

const aiPersonalities: AiPersonality[] = [
  {
    id: "anthropic",
    name: "Polaris",
    description: "Smart and fast, but blurts answers",
    provider: "anthropic"
  },
  {
    id: "perplexity",
    name: "Faraday",
    description: "Takes time to pull answers together",
    provider: "perplexity"
  },
  {
    id: "groq",
    name: "Maggie",
    description: "Efficient and gets work done quick",
    provider: "groq"
  },
  {
    id: "openai",
    name: "Magnes",
    description: "The artistic one",
    provider: "openai"
  }
];

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3 text-sm">Select AI Personality</h3>
      <RadioGroup
        value={selectedModel}
        onValueChange={onModelChange}
        className="flex flex-col gap-3"
      >
        {aiPersonalities.map((ai) => (
          <div key={ai.id} className="flex items-center space-x-2">
            <RadioGroupItem value={ai.id} id={ai.id} />
            <Label htmlFor={ai.id} className="flex items-center gap-2 text-sm">
              <span className="font-medium">{ai.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-xs text-muted-foreground">ℹ️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{ai.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};