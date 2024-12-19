import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ApiProvider = 'perplexity' | 'openai' | 'anthropic' | 'groq';
type ApiStatus = 'checking' | 'up' | 'down';

interface ApiStatusState {
  [key: string]: ApiStatus;
}

export const ApiStatusCard = () => {
  const [statuses, setStatuses] = useState<ApiStatusState>({
    perplexity: 'checking',
    openai: 'checking',
    anthropic: 'checking',
    groq: 'checking'
  });

  const checkApiStatus = async (provider: ApiProvider) => {
    try {
      const { data, error } = await supabase.functions.invoke('check-service-status', {
        body: { provider }
      });

      if (error) {
        console.error(`Error checking ${provider} status:`, error);
        return 'down' as ApiStatus;
      }

      return data?.status || 'down' as ApiStatus;
    } catch (error) {
      console.error(`Error checking ${provider} status:`, error);
      return 'down' as ApiStatus;
    }
  };

  const checkAllStatuses = async () => {
    const providers: ApiProvider[] = ['perplexity', 'openai', 'anthropic', 'groq'];
    
    try {
      const results = await Promise.all(
        providers.map(async (provider) => {
          const status = await checkApiStatus(provider);
          return { provider, status };
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
      toast.error("Failed to check API statuses");
    }
  };

  useEffect(() => {
    checkAllStatuses();
    const interval = setInterval(checkAllStatuses, 300000); // 300 seconds = 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ApiStatus) => {
    switch (status) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const providerLabels: Record<ApiProvider, string> = {
    perplexity: 'P',
    openai: 'O',
    anthropic: 'A',
    groq: 'G'
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">API Status</h3>
      <div className="flex gap-3">
        {Object.entries(statuses).map(([provider, status]) => (
          <div key={provider} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{providerLabels[provider as ApiProvider]}</span>
              <div 
                className={`w-3 h-3 rounded-full ${getStatusColor(status)} mt-1`}
                title={`${provider}: ${status}`}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};