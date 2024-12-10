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
  onModelChange: (value: string) => void;
}

type ApiStatus = 'checking' | 'up' | 'down';

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

    // Initial check
    checkApiStatus();

    // Set up interval for checking every 90 seconds
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

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">Select AI Personality</h3>
      <RadioGroup
        value={selectedModel}
        onValueChange={onModelChange}
        className="flex flex-col gap-3"
      >
        {aiPersonalities.map((ai) => (
          <div key={ai.id} className="flex items-center space-x-2">
            <RadioGroupItem value={ai.id} id={ai.id} />
            <Label htmlFor={ai.id} className="flex items-center gap-2">
              <span className="font-medium">{ai.name}</span>
              {getStatusIcon(statuses[ai.provider])}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-sm text-muted-foreground">ℹ️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ai.description}</p>
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