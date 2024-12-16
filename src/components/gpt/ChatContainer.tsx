import { useRef, useEffect } from "react";
import { ChatActions } from "./ChatActions";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { useChatMessages } from "./chat/useChatMessages";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
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
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    onMessagesChange(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatActions onNewChat={handleNewChat} />
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      <ChatInput
        input=""
        setInput={() => {}}
        isLoading={isLoading}
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input')?.value || '';
          handleSubmit(input);
        }}
        onFileUpload={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
    </div>
  );
};