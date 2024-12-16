import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MessageBubble } from "./chat/MessageBubble";
import { MessageInput } from "./chat/MessageInput";
import { useChatState } from "./chat/useChatState";

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
  inputValue: externalInputValue,
  setInputValue: setExternalInputValue,
  onNewChat
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    handleSubmit,
    setMessages
  } = useChatState(systemPrompt, onHistoryUpdate);

  useEffect(() => {
    setInputValue(externalInputValue);
  }, [externalInputValue]);

  useEffect(() => {
    setExternalInputValue(inputValue);
  }, [inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};