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
    <div className="md:col-span-8">
      <div className="flex flex-col space-y-4">
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