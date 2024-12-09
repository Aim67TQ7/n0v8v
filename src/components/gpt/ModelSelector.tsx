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
  "gpt-4o": "Most capable model, best for complex tasks",
  "gpt-4o-mini": "Faster responses, good for simpler tasks"
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
              <span className="capitalize">{model}</span>
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