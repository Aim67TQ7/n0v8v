import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const useChatState = (
  systemPrompt: string,
  onHistoryUpdate?: () => void
) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: systemPrompt }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const saveChatLog = async (messages: Message[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profile?.company_id) return;

      const jsonMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      await supabase.from('chat_logs').insert({
        company_id: profile.company_id,
        user_id: session.user.id,
        model: 'anthropic',
        messages: jsonMessages,
        title: messages[1]?.content.slice(0, 50) || 'New Chat'
      });

      onHistoryUpdate?.();
    } catch (error) {
      console.error('Error in saveChatLog:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to use the chat",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: [...messages, userMessage],
          model: 'claude-3-sonnet-20240229'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.content) {
        const assistantMessage = { 
          role: "assistant" as const, 
          content: data.content 
        };
        
        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);
        await saveChatLog(updatedMessages);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    handleSubmit,
    setMessages
  };
};