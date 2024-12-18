import { Card } from "@/components/ui/card";
import { CompanyNews } from "@/components/hub/CompanyNews";
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
      <Card className="p-4 mt-4 flex-shrink-0">
        <h2 className="font-semibold mb-4">Company News</h2>
        <CompanyNews />
      </Card>
    </div>
  );
};