import { Card } from "@/components/ui/card";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { ChatContainer } from "@/components/hub/chat/ChatContainer";
import { useState } from "react";

export const MainContent = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  return (
    <div className="md:col-span-8">
      <div className="h-full flex flex-col space-y-4">
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Company News</h2>
          <CompanyNews />
        </Card>
        <ChatContainer messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};