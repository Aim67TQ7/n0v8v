import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Agent } from "@/types/agents";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentChatProps {
  selectedAgent: Agent | null;
}

export const AgentChat = ({ selectedAgent }: AgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const agent = JSON.parse(e.dataTransfer.getData('application/json')) as Agent;
      toast.success(`${agent.name} is ready to assist you!`);
    } catch (error) {
      console.error('Error parsing dropped agent:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: [...messages, userMessage],
          systemPrompt: selectedAgent.description
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from the agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="h-[calc(100vh-8rem)] flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {selectedAgent && (
            <div className="mb-4 p-4 bg-accent rounded-lg">
              <h3 className="font-medium">{selectedAgent.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedAgent ? `Chat with ${selectedAgent.name}...` : "Drag an agent to start chatting..."}
            className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            disabled={!selectedAgent || isLoading}
          />
          <Button type="submit" size="icon" disabled={!selectedAgent || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};