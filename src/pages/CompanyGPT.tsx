import { useState, useEffect } from "react";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { ChatHeader } from "@/components/gpt/ChatHeader";
import { QuickPrompts } from "@/components/gpt/QuickPrompts";
import { ChatSettings } from "@/components/gpt/ChatSettings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const CompanyGPT = () => {
  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setChatHistory(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    }
  };

  const createNewChat = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .insert({
          user_id: user?.id,
          model: 'gpt-4',
          messages: [],
          title: 'New Chat'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentChatId(data.id);
      setMessages([]);
      loadChatHistory();
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive"
      });
    }
  };

  const handlePromptSelect = (prompt: string) => {
    if (!currentChatId) {
      createNewChat().then(() => {
        setMessages([{ role: 'user', content: prompt }]);
      });
    } else {
      setMessages([...messages, { role: 'user', content: prompt }]);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column - Company Info, Chat History, Settings */}
      <div className="w-64 border-r bg-gray-50">
        <Card className="m-4">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Company Info</h3>
            {/* Company info content */}
          </div>
        </Card>
        
        <Card className="m-4">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Chat History</h3>
            <ChatHistory
              sessions={chatHistory}
              selectedId={currentChatId}
              onSelect={setCurrentChatId}
            />
          </div>
        </Card>

        <Card className="m-4">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Settings</h3>
            <ChatSettings />
          </div>
        </Card>
      </div>

      {/* Middle Three Columns - Main Content */}
      <div className="flex-1 flex flex-col">
        <Card className="m-4 flex-1">
          {/* Company Logo */}
          <div className="p-4 flex justify-center">
            <img 
              src="/lovable-uploads/9f8b4a02-e5ce-48c8-a7c6-3195ee5e8cdc.png" 
              alt="Company Logo" 
              className="h-32 w-32 object-contain"
            />
          </div>

          {/* Company News Scroll - Height reduced */}
          <div className="p-2 border-t border-b">
            <div className="h-12 overflow-y-auto">
              <h3 className="font-semibold text-sm mb-1">Company News</h3>
              {/* Add news content here */}
            </div>
          </div>

          {/* Chat Conversation */}
          <div className="flex-1 p-4">
            <ChatContainer
              messages={messages}
              onMessagesChange={setMessages}
              chatId={currentChatId}
            />
          </div>

          {/* Chat Entry Box */}
          <div className="p-4 border-t">
            <Button
              className="w-full"
              onClick={createNewChat}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Column - Resources, Modules, Tools */}
      <div className="w-64 border-l bg-gray-50">
        <Card className="m-4">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Resources</h3>
            <ResourceSidebar />
          </div>
        </Card>

        <Card className="m-4">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Modules</h3>
            {/* Add modules content */}
          </div>
        </Card>

        <Card className="m-4">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Tools</h3>
            <QuickPrompts onPromptSelect={handlePromptSelect} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyGPT;
