import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  selectedModel: string;
  allowedModels: string[];
  onModelChange: (value: string) => void;
}

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
            <Label htmlFor={model} className="capitalize">{model}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};