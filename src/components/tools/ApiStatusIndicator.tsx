import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ApiStatusIndicator = () => {
  const [statuses, setStatuses] = useState({
    openai: 'checking' as const,
    anthropic: 'checking' as const
  });

  const checkApiStatus = async () => {
    try {
      const results = await Promise.all([
        supabase.functions.invoke('check-service-status', { body: { provider: 'openai' } }),
        supabase.functions.invoke('check-service-status', { body: { provider: 'anthropic' } })
      ]);

      setStatuses({
        openai: results[0].data?.status || 'down',
        anthropic: results[1].data?.status || 'down'
      });
    } catch (error) {
      console.error('Error checking API status:', error);
      setStatuses({
        openai: 'down',
        anthropic: 'down'
      });
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-1 items-center ml-2">
      {Object.values(statuses).map((status, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full ${
            status === 'up' 
              ? 'bg-green-500' 
              : status === 'checking' 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
          }`}
          title="API Status"
        />
      ))}
    </div>
  );
};