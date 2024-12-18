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

  return (
    <div className="md:col-span-8">
      <div className="flex flex-col space-y-4">
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Company News</h2>
          <CompanyNews />
        </Card>
        <ChatContainer 
          messages={messages}
          onMessagesChange={handleMessagesChange}
          chatId={chatId}
        />
      </div>
    </div>
  );
};