import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelSelectorProps {
  selectedModel: string;
  allowedModels: string[];
  onModelChange: (value: string) => void;
}

const modelInfo = {
  "gpt-4o": "Magnus - Direct and thorough, takes its time to provide comprehensive answers",
  "gpt-4o-mini": "Maggie - Faster and more considerate, good for quick conversations"
};

const modelDisplayNames = {
  "gpt-4o": "Magnus",
  "gpt-4o-mini": "Maggie"
};

export const ModelSelector = ({ selectedModel, allowedModels, onModelChange }: ModelSelectorProps) => {
  return (
    <div className="mb-6">
      <RadioGroup
        value={selectedModel}
        onValueChange={onModelChange}
        className="flex gap-4"
      >
        {allowedModels.map((model) => (
          <div key={model} className="flex items-center space-x-2">
            <RadioGroupItem value={model} id={model} />
            <Label htmlFor={model} className="flex items-center gap-1">
              <span className="capitalize">{modelDisplayNames[model as keyof typeof modelDisplayNames]}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{modelInfo[model as keyof typeof modelInfo]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};