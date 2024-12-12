import { useState, useEffect } from "react";
import { ChatInterface } from "./ChatInterface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ChatContainerProps {
  selectedSession?: string;
  chatSessions: any[];
  onHistoryUpdate: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export const ChatContainer = ({ 
  selectedSession, 
  chatSessions,
  onHistoryUpdate,
  inputValue,
  setInputValue
}: ChatContainerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSuperUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'superuser') {
          toast({
            title: "Access Denied",
            description: "Only superusers can access this feature.",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking superuser status:', error);
        toast({
          title: "Error",
          description: "Failed to verify access permissions.",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperUser();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pb-[120px] overflow-y-auto">
            <ChatInterface 
              systemPrompt={`You are BuntingGPT, an AI assistant specialized in magnetic separation and metal detection solutions.`}
              onHistoryUpdate={onHistoryUpdate}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};