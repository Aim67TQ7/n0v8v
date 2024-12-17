import { useRef, useEffect, useState } from "react";
import { ChatActions } from "./ChatActions";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { useChatMessages } from "./chat/useChatMessages";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    url: string;
  };
}

interface ChatContainerProps {
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
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
  const [inputValue, setInputValue] = useState("");
  const { 
    messages,
    setMessages,
    isLoading,
    handleSubmit
  } = useChatMessages(chatId);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleSubmit(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full">
      <ChatActions onNewChat={onNewChat} />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <ChatInput
        input={inputValue}
        setInput={setInputValue}
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};