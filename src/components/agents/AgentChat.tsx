import { Card } from "@/components/ui/card";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { useState } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AgentChat = () => {
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
    <Card className="h-[calc(100vh-8rem)]">
      <ChatContainer 
        messages={messages}
        onMessagesChange={handleMessagesChange}
        chatId={chatId}
        onNewChat={handleNewChat}
      />
    </Card>
  );
};