import { Card } from "@/components/ui/card";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { useState } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MainContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <ChatContainer 
          messages={messages}
          onMessagesChange={handleMessagesChange}
          chatId={chatId}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
};