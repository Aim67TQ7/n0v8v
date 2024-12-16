import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ApiProvider = 'openai' | 'anthropic' | 'perplexity' | 'groq';
type ApiStatus = 'checking' | 'up' | 'down' | 'idle';

const providers: { name: ApiProvider; label: string }[] = [
  { name: 'openai', label: 'OpenAI' },
  { name: 'anthropic', label: 'Anthropic' },
  { name: 'perplexity', label: 'Perplexity' },
  { name: 'groq', label: 'Groq' }
];

const AIStatus = () => {
  const [statuses, setStatuses] = useState<Record<ApiProvider, ApiStatus>>({
    openai: 'idle',
    anthropic: 'idle',
    perplexity: 'idle',
    groq: 'idle'
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkAllApiStatuses = async () => {
    setIsChecking(true);
    // Set all statuses to checking
    setStatuses(prev => {
      const newStatuses = { ...prev };
      providers.forEach(({ name }) => {
        newStatuses[name] = 'checking';
      });
      return newStatuses;
    });

    try {
      const results = await Promise.all(
        providers.map(async ({ name }) => {
          try {
            const { data, error } = await supabase.functions.invoke('check-ai-status', {
              body: { provider: name }
            });

            if (error) {
              console.error(`Error checking ${name} API:`, error);
              return { provider: name, status: 'down' as ApiStatus };
            }

            return { provider: name, status: data?.status || 'down' as ApiStatus };
          } catch (error) {
            console.error(`Error checking ${name} API:`, error);
            return { provider: name, status: 'down' as ApiStatus };
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

      toast.success("API status check completed");
    } catch (error) {
      console.error('Error checking API statuses:', error);
      toast.error("Failed to check API statuses");
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: ApiStatus) => {
    switch (status) {
      case 'checking':
        return <Loader className="h-5 w-5 animate-spin text-yellow-500" />;
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-200" />;
    }
  };

  const getStatusText = (status: ApiStatus) => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'up':
        return 'Operational';
      case 'down':
        return 'Down';
      default:
        return 'Not checked';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bot className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">AI Services Status</h1>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Check the operational status of all AI services
          </p>
          <Button 
            onClick={checkAllApiStatuses} 
            disabled={isChecking}
            className="min-w-[150px]"
          >
            {isChecking ? 'Checking...' : 'Check Status'}
          </Button>
        </div>

        <div className="space-y-4">
          {providers.map(({ name, label }) => (
            <div 
              key={name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8">{getStatusIcon(statuses[name])}</div>
                <span className="font-medium">{label}</span>
              </div>
              <span className="text-sm text-gray-600">
                {getStatusText(statuses[name])}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AIStatus;