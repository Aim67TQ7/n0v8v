import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatInterfaceProps {
  systemPrompt?: string;
  onHistoryUpdate?: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export const ChatInterface = ({ 
  systemPrompt = "You are a helpful AI assistant.",
  onHistoryUpdate,
  inputValue,
  setInputValue
}: ChatInterfaceProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleEmailOpen = (emailContent: string) => {
    const mailtoLink = `mailto:?subject=Invitation to Test Our Platform&body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;
    toast({
      title: "Email Client Opened",
      description: "Your default email client has been opened with the invitation draft.",
    });
  };

  const handleFiveWhysRedirect = (problemStatement: string) => {
    navigate("/operations/quality/five-whys", {
      state: { problemStatement }
    });
    toast({
      title: "Analysis Started",
      description: "Redirecting you to the Five Whys module to begin your analysis.",
    });
  };

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

      // Generate a title from the first user message
      const firstUserMessage = messages.find(msg => msg.role === 'user');
      const title = firstUserMessage 
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
        : 'New Chat';

      const { error: insertError } = await supabase.from('chat_logs').insert({
        company_id: profile.company_id,
        user_id: session.user.id,
        model: 'groq',
        messages: jsonMessages,
        title: title
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

      const response = await supabase.functions.invoke('chat-with-groq', {
        body: {
          messages: [...messages, userMessage]
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const assistantMessage = { 
        role: "assistant" as const, 
        content: response.data.choices[0].message.content 
      };
      
      const lastMessages = [...messages, userMessage, assistantMessage];
      
      // Check for email confirmation
      const isEmailConfirmation = lastMessages.some(msg => 
        msg.role === "user" && 
        /^(yes|yeah|sure|okay|ok|proceed|open email)$/i.test(msg.content.trim())
      );
      
      const hasEmailPrompt = lastMessages.some(msg => 
        msg.role === "system" && 
        msg.content.includes("invitation emails")
      );

      if (isEmailConfirmation && hasEmailPrompt) {
        // Extract the email content from the assistant's last message before confirmation
        const emailContent = lastMessages
          .filter(msg => msg.role === "assistant")
          .slice(-2)[0]?.content || "";
        
        handleEmailOpen(emailContent);
      }

      // Check for Five Whys confirmation
      const isFiveWhysConfirmation = lastMessages.some(msg => 
        msg.role === "user" && 
        /^(yes|yeah|sure|okay|ok|proceed|let's do it|start)$/i.test(msg.content.trim())
      );
      
      const hasFiveWhysPrompt = lastMessages.some(msg => 
        msg.role === "system" && 
        msg.content.includes("root cause analysis")
      );

      if (isFiveWhysConfirmation && hasFiveWhysPrompt) {
        const problemDescription = lastMessages
          .filter(msg => msg.role === "user")
          .map(msg => msg.content)
          .join(" ");
        
        handleFiveWhysRedirect(problemDescription);
      }

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
    <div className="relative flex flex-col min-h-full">
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent"
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
              className="flex-1 min-h-[60px] resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};