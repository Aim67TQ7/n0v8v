import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ApiProvider = 'groq' | 'openai' | 'anthropic' | 'perplexity';
type ApiStatus = 'checking' | 'up' | 'down';

export const ApiStatus = () => {
  const [statuses, setStatuses] = useState<Record<ApiProvider, ApiStatus>>({
    groq: 'checking',
    openai: 'checking',
    anthropic: 'checking',
    perplexity: 'checking'
  });

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Check all APIs
        const providers: ApiProvider[] = ['groq', 'openai', 'anthropic', 'perplexity'];
        
        const results = await Promise.all(
          providers.map(async (provider) => {
            try {
              const response = await supabase.functions.invoke('check-ai-status', {
                body: { provider }
              });
              return { provider, status: response.error ? 'down' : 'up' };
            } catch (error) {
              console.error(`Error checking ${provider} API:`, error);
              return { provider, status: 'down' };
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
        setStatuses(prev => ({
          ...prev,
          groq: 'down',
          openai: 'down',
          anthropic: 'down',
          perplexity: 'down'
        }));
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
    <div className="flex items-center gap-3">
      {(Object.entries(statuses) as [ApiProvider, ApiStatus][]).map(([provider, status]) => (
        <TooltipProvider key={provider}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground capitalize">{provider}</span>
                {getStatusIcon(status)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{provider.toUpperCase()} API is {status === 'checking' ? 'being checked' : status === 'up' ? 'operational' : 'down'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};