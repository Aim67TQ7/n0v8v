import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

type ServiceProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'perplexity' 
  | 'groq'
  | 'twilio'
  | 'stripe'
  | 'apify'
  | 'resend'
  | 'smtp';

type ServiceStatus = 'checking' | 'up' | 'down';

export const ApiStatus = () => {
  const [statuses, setStatuses] = useState<Record<ServiceProvider, ServiceStatus>>({
    openai: 'checking',
    anthropic: 'checking',
    perplexity: 'checking',
    groq: 'checking',
    twilio: 'checking',
    stripe: 'checking',
    apify: 'checking',
    resend: 'checking',
    smtp: 'checking'
  });

  const checkAllServices = async () => {
    try {
      const providers: ServiceProvider[] = [
        'openai', 'anthropic', 'perplexity', 'groq',
        'twilio', 'stripe', 'apify', 'resend', 'smtp'
      ];
      
      setStatuses(prev => {
        const newStatuses = { ...prev };
        providers.forEach(provider => {
          newStatuses[provider] = 'checking';
        });
        return newStatuses;
      });

      const results = await Promise.all(
        providers.map(async (provider) => {
          try {
            const { data, error } = await supabase.functions.invoke('check-service-status', {
              body: { provider }
            });

            if (error) {
              console.error(`Error checking ${provider} service:`, error);
              return { provider, status: 'down' as ServiceStatus };
            }

            return { provider, status: data?.status || 'down' as ServiceStatus };
          } catch (error) {
            console.error(`Error checking ${provider} service:`, error);
            return { provider, status: 'down' as ServiceStatus };
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
      console.error('Error checking service statuses:', error);
      toast.error("Failed to check service statuses");
      setStatuses(prev => ({
        ...prev,
        openai: 'down',
        anthropic: 'down',
        perplexity: 'down',
        groq: 'down',
        twilio: 'down',
        stripe: 'down',
        apify: 'down',
        resend: 'down',
        smtp: 'down'
      }));
    }
  };

  useEffect(() => {
    // Check status on component mount
    checkAllServices();

    // Listen for manual check triggers
    const handleStatusCheck = () => checkAllServices();
    window.addEventListener('checkStatus', handleStatusCheck);

    return () => {
      window.removeEventListener('checkStatus', handleStatusCheck);
    };
  }, []);

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'checking':
        return <Loader className="h-5 w-5 animate-spin text-yellow-500" />;
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'up':
        return 'Operational';
      case 'down':
        return 'Down';
    }
  };

  const providerLabels: Record<ServiceProvider, string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    perplexity: 'Perplexity',
    groq: 'Groq',
    twilio: 'Twilio',
    stripe: 'Stripe',
    apify: 'Apify',
    resend: 'Resend',
    smtp: 'SMTP'
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(statuses).map(([provider, status]) => (
        <TooltipProvider key={provider}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center justify-between w-full bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <span className="font-medium">{providerLabels[provider as ServiceProvider]}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {getStatusText(status)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{providerLabels[provider as ServiceProvider]} API is {status === 'checking' ? 'being checked' : status === 'up' ? 'operational' : 'down'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};