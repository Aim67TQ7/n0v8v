import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ChatStreamHandler } from "./ChatStreamHandler";
import { ChatActions } from "./ChatActions";

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
  systemPrompt = `I am an AI assistant specialized in manufacturing and operations...`,
  onHistoryUpdate,
  inputValue,
  setInputValue
}: ChatInterfaceProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: systemPrompt }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Use ChatStreamHandler for stream processing
    await ChatStreamHandler({ 
      messages: [...messages, userMessage],
      setMessages,
      setIsLoading,
      abortControllerRef
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden relative">
        <ChatMessages messages={messages} />
        {isLoading && (
          <div className="absolute bottom-4 right-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={stopGeneration}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Stop generating
            </Button>
          </div>
        )}
      </div>
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <ChatActions 
        messages={messages}
        handleEmailOpen={handleEmailOpen}
        handleFiveWhysRedirect={handleFiveWhysRedirect}
      />
    </div>
  );
};