import { useState, useEffect } from "react";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { ChatHeader } from "@/components/gpt/ChatHeader";
import { QuickPrompts } from "@/components/gpt/QuickPrompts";
import { ChatSettings } from "@/components/gpt/ChatSettings";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    loadChatHistory();
  }, []);

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
      {/* Left Column */}
      <div className={`border-r flex flex-col ${isLeftColumnCollapsed ? 'w-12' : 'w-64'} transition-all duration-300`}>
        <ChatHeader
          isCollapsed={isLeftColumnCollapsed}
          onToggle={() => setIsLeftColumnCollapsed(!isLeftColumnCollapsed)}
        />
        
        <div className={`p-2 ${isLeftColumnCollapsed ? 'hidden' : 'block'}`}>
          <Button
            className="w-full mb-4"
            onClick={createNewChat}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className={`flex-1 overflow-y-auto ${isLeftColumnCollapsed ? 'hidden' : 'block'}`}>
          <ChatHistory
            history={chatHistory}
            currentChatId={currentChatId}
            onSelectChat={setCurrentChatId}
          />
          <QuickPrompts onPromptSelect={handlePromptSelect} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatContainer
          messages={messages}
          onMessagesChange={setMessages}
          chatId={currentChatId}
        />
      </div>

      {/* Right Column */}
      <div className="w-64 border-l">
        <ResourceSidebar />
        <ChatSettings />
      </div>
    </div>
  );
};

export default CompanyGPT;