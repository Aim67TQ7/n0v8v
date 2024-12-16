import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";
import { Plus } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatInterfaceProps {
  systemPrompt?: string;
  onHistoryUpdate?: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onNewChat?: () => void;
}

export const ChatInterface = ({ 
  systemPrompt = "You are a helpful AI assistant.",
  onHistoryUpdate,
  inputValue,
  setInputValue,
  onNewChat
}: ChatInterfaceProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: systemPrompt }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChatLog = async (messages: Message[]) => {
    try {
      if (!session?.user?.id) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      if (!profile?.company_id) {
        console.error('No company ID found for user');
        return;
      }

      const jsonMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })) as Json;

      const { error: insertError } = await supabase.from('chat_logs').insert({
        company_id: profile.company_id,
        user_id: session.user.id,
        model: 'anthropic',
        messages: jsonMessages,
        title: messages[1]?.content.slice(0, 50) || 'New Chat'
      });

      if (insertError) {
        console.error('Error saving chat log:', insertError);
        return;
      }

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

      console.log('Sending chat request with messages:', [...messages, userMessage]);

      const response = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: [...messages, userMessage]
        },
      });

      console.log('Received response:', response);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const assistantMessage = { 
        role: "assistant" as const, 
        content: response.data.content[0].text 
      };
      
      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      await saveChatLog(updatedMessages);

    } catch (error) {
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

  return (
    <div className="relative flex flex-col min-h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4">
          {messages.slice(1).map((message, index) => (
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
      </div>

      <Card className="fixed bottom-0 left-64 right-64 mx-auto bg-white border-t shadow-lg">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px] resize-none text-sm text-gray-900 bg-white border-gray-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};