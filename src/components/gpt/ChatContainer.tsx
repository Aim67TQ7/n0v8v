import { useRef, useEffect, useState } from "react";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
  chatId: string | null;
  onNewChat?: () => void;
}

export const ChatContainer = ({ 
  messages: initialMessages, 
  onMessagesChange, 
  chatId,
  onNewChat
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    onMessagesChange(messages);
  }, [messages, onMessagesChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending message to chat-with-anthropic:', userMessage);
      
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

      console.log('Received response:', data);

      if (data?.content) {
        const assistantMessage = { 
          role: "assistant", 
          content: data.content 
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        </div>
      </div>
      <div className="border-t bg-background sticky bottom-0">
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSubmit={handleMessageSubmit}
        />
      </div>
    </div>
  );
};