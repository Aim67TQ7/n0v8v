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
      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: [...messages, userMessage]
        }
      });

      if (error) throw error;

      console.log('API Response:', data);

      if (data.content) {
        const assistantMessage = { 
          role: "assistant", 
          content: data.content 
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-background">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        </div>
      </div>
      <div className="border-t bg-background mt-auto">
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