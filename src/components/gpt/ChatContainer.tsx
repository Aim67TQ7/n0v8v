import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Plus } from "lucide-react";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
  chatId: string | null;
  onNewChat?: () => void;
}

export const ChatContainer = ({ messages, onMessagesChange, chatId, onNewChat }: ChatContainerProps) => {
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
    if (!input.trim() || !chatId || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      onMessagesChange(newMessages);
      setInput("");

      const response = await supabase.functions.invoke('chat-with-groq', {
        body: {
          messages: newMessages
        },
      });

      if (response.error) throw new Error(response.error.message);

      const assistantMessage = { 
        role: "assistant", 
        content: response.data.choices[0].message.content 
      };
      
      onMessagesChange([...newMessages, assistantMessage]);
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Card className="p-4 border-t">
        <div className="flex gap-2 items-center">
          {onNewChat && (
            <Button
              variant="outline"
              size="icon"
              onClick={onNewChat}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};