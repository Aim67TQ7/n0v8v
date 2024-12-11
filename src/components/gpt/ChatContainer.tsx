import { useState, useEffect } from "react";
import { ChatInterface } from "./ChatInterface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatContainerProps {
  selectedSession?: string;
  chatSessions: any[];
  onHistoryUpdate: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  systemPrompt?: string;
}

export const ChatContainer = ({ 
  selectedSession, 
  chatSessions,
  onHistoryUpdate,
  inputValue,
  setInputValue,
  systemPrompt
}: ChatContainerProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the chat interface.",
        variant: "destructive",
      });
    }
  }, [session, toast]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to use the chat interface</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pb-[200px]">
            <ChatInterface 
              systemPrompt={systemPrompt}
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