import { useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatStreamHandlerProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: (isLoading: boolean) => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
}

export const ChatStreamHandler = ({ 
  messages, 
  setMessages, 
  setIsLoading,
  abortControllerRef 
}: ChatStreamHandlerProps) => {
  const { toast } = useToast();

  const handleStream = async () => {
    try {
      abortControllerRef.current = new AbortController();
      const { data: { stream }, error } = await supabase.functions.invoke('chat-with-groq', {
        body: { messages }
      });

      if (error) throw error;

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: "assistant" as const, content: "" };
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.choices[0].delta?.content) {
                assistantMessage.content += data.choices[0].delta.content;
                setMessages(prev => [
                  ...prev.slice(0, -1),
                  { ...assistantMessage }
                ]);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  handleStream();

  return null; // This is a logic-only component
};