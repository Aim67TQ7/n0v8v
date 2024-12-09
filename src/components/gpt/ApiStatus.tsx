import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ApiStatus = () => {
  const [groqStatus, setGroqStatus] = useState<'checking' | 'up' | 'down'>('checking');
  const [openaiStatus, setOpenaiStatus] = useState<'checking' | 'up' | 'down'>('checking');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Check GROQ API
        const groqResponse = await supabase.functions.invoke('chat-with-groq', {
          body: { messages: [{ role: 'system', content: 'test' }] },
        });
        setGroqStatus(groqResponse.error ? 'down' : 'up');

        // Check OpenAI API
        const openaiResponse = await supabase.functions.invoke('chat-with-groq', {
          body: { messages: [{ role: 'system', content: 'test' }] },
        });
        setOpenaiStatus(openaiResponse.error ? 'down' : 'up');
      } catch (error) {
        console.error('Error checking API status:', error);
        setGroqStatus('down');
        setOpenaiStatus('down');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'checking' | 'up' | 'down') => {
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
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">GROQ</span>
              {getStatusIcon(groqStatus)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>GROQ API is {groqStatus === 'checking' ? 'being checked' : groqStatus === 'up' ? 'operational' : 'down'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">OpenAI</span>
              {getStatusIcon(openaiStatus)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>OpenAI API is {openaiStatus === 'checking' ? 'being checked' : openaiStatus === 'up' ? 'operational' : 'down'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};