import { useRef, useEffect, useState } from "react";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { useChatMessages } from "./chat/useChatMessages";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
  chatId: string | null;
  onNewChat?: () => void;  // Made optional with ?
}

export const ChatContainer = ({ 
  messages: initialMessages, 
  onMessagesChange, 
  chatId,
  onNewChat
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const { 
    messages,
    setMessages,
    isLoading,
    handleSubmit,
  } = useChatMessages(chatId);

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
    
    await handleSubmit(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[600px] bg-background">
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <div className="border-t">
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSubmit={handleMessageSubmit}
          onNew={onNewChat}
        />
      </div>
    </div>
  );
};