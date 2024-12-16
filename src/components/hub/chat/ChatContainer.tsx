import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatContainerProps {
  messages: Array<{ role: 'user' | 'assistant', content: string }>;
  setMessages: React.Dispatch<React.SetStateAction<Array<{ role: 'user' | 'assistant', content: string }>>>;
}

export const ChatContainer = ({ messages, setMessages }: ChatContainerProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user' as const, content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage("");

      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: [...messages, userMessage]
        }
      });

      if (error) throw error;

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.content[0].text 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 flex-1 relative">
      <div className="space-y-4 mb-4 h-[calc(100vh-32rem)] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-primary text-white ml-auto max-w-[80%]' 
                : 'bg-muted max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2">
          <Textarea
            placeholder="Type your message..."
            className="flex-1 text-xs"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </Card>
  );
};