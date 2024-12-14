import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
  chatId: string | null;
}

export const ChatContainer = ({ messages, onMessagesChange, chatId }: ChatContainerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId && messages.length > 0) {
      updateChatMessages();
    }
  }, [messages, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateChatMessages = async () => {
    try {
      const { error } = await supabase
        .from('chat_logs')
        .update({ messages })
        .eq('id', chatId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving messages:', error);
      toast({
        title: "Error",
        description: "Failed to save chat messages",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      onMessagesChange(newMessages);
      setInput("");

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          chatId: chatId
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      onMessagesChange([...newMessages, data.message]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`p-4 ${
              message.role === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="font-medium min-w-[60px]">
                {message.role === 'user' ? 'You' : 'Assistant'}:
              </div>
              <div className="flex-1 whitespace-pre-wrap">{message.content}</div>
            </div>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};