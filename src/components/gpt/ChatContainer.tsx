import { useRef, useEffect } from "react";
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
  const { 
    messages,
    setMessages,
    isLoading,
    handleSubmit,
    handleFileUpload
  } = useChatMessages(chatId);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  useEffect(() => {
    if (onMessagesChange && messages) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = async (input: string) => {
    if (!input.trim()) return;
    await handleSubmit(input);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatActions onNewChat={onNewChat} />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <ChatInput
        input=""
        setInput={() => {}}
        isLoading={isLoading}
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.querySelector('textarea')?.value;
          if (input) {
            handleFormSubmit(input);
            form.reset();
          }
        }}
        onNew={onNewChat}
      />
    </div>
  );
};