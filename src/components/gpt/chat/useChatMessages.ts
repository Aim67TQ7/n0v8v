import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: newMessages,
          model: 'claude-3-sonnet-20240229'
        },
      });

      if (error) throw error;

      if (data?.message) {
        setMessages([...newMessages, data.message]);
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process message",
        variant: "destructive"
      });
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    handleSubmit
  };
};