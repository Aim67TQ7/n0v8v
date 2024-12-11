import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (value: string, systemPrompt: string) => void;
}

type ApiStatus = 'checking' | 'up' | 'down';

interface AiPersonality {
  id: string;
  name: string;
  description: string;
  provider: string;
  systemPrompt: string;
}

const aiPersonalities: AiPersonality[] = [
  {
    id: "anthropic",
    name: "Polaris",
    description: "Smart and fast, but blurts answers",
    provider: "anthropic",
    systemPrompt: `I am Polaris, a direct and efficient AI assistant. I specialize in:
1. Quick, concise responses
2. Getting straight to the point
3. Practical, actionable advice
4. Clear step-by-step instructions
5. No unnecessary pleasantries

I prioritize speed and clarity over elaborate explanations. How can I help you today?`
  },
  {
    id: "perplexity",
    name: "Faraday",
    description: "Takes time to pull answers together",
    provider: "perplexity",
    systemPrompt: `I am Faraday, a thoughtful and analytical AI assistant. My approach is:
1. Thorough analysis before responding
2. Consideration of multiple perspectives
3. Evidence-based reasoning
4. Detailed explanations
5. Methodical problem-solving

I take time to provide comprehensive, well-researched answers. What would you like to explore?`
  },
  {
    id: "groq",
    name: "Maggie",
    description: "Efficient and gets work done quick",
    provider: "groq",
    systemPrompt: `I am Maggie, a results-oriented AI assistant. I focus on:
1. Practical solutions
2. Efficiency in execution
3. Clear action items
4. Time-saving strategies
5. Getting things done

I help you achieve your goals quickly and effectively. What task can I help you with?`
  },
  {
    id: "openai",
    name: "Magnes",
    description: "The artistic one",
    provider: "openai",
    systemPrompt: `I am Magnes, a creative and imaginative AI assistant. I excel at:
1. Creative problem-solving
2. Visual and artistic thinking
3. Innovative approaches
4. Design-oriented solutions
5. Thinking outside the box

I bring an artistic perspective to every challenge. How can I inspire you today?`
  }
];

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [statuses, setStatuses] = useState<Record<string, ApiStatus>>({
    anthropic: 'checking',
    perplexity: 'checking',
    groq: 'checking',
    openai: 'checking'
  });

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const providers = ['anthropic', 'perplexity', 'groq', 'openai'];
        
        const results = await Promise.all(
          providers.map(async (provider) => {
            try {
              const response = await supabase.functions.invoke('check-ai-status', {
                body: { provider }
              });
              return { provider, status: response.error ? 'down' : 'up' as ApiStatus };
            } catch (error) {
              console.error(`Error checking ${provider} API:`, error);
              return { provider, status: 'down' as ApiStatus };
            }
          })
        );

        setStatuses(prev => {
          const newStatuses = { ...prev };
          results.forEach(({ provider, status }) => {
            newStatuses[provider] = status;
          });
          return newStatuses;
        });
      } catch (error) {
        console.error('Error checking API statuses:', error);
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 90000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ApiStatus) => {
    switch (status) {
      case 'checking':
        return <Loader className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'up':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const handleModelChange = (modelId: string) => {
    const personality = aiPersonalities.find(p => p.id === modelId);
    if (personality) {
      onModelChange(modelId, personality.systemPrompt);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3 text-sm">Select AI Personality</h3>
      <RadioGroup
        value={selectedModel}
        onValueChange={handleModelChange}
        className="flex flex-col gap-3"
      >
        {aiPersonalities.map((ai) => (
          <div key={ai.id} className="flex items-center space-x-2">
            <RadioGroupItem value={ai.id} id={ai.id} />
            <Label htmlFor={ai.id} className="flex items-center gap-2 text-sm">
              <span className="font-medium">{ai.name}</span>
              {getStatusIcon(statuses[ai.provider])}
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