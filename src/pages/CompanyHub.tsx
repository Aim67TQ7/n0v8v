import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { HubLinks } from "@/components/hub/HubLinks";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const CompanyHub = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      loadCurrentChat();
    }
  }, [currentChatId]);

  const loadCurrentChat = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('messages')
        .eq('id', currentChatId)
        .single();

      if (error) throw error;
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading chat:', error);
      toast({
        title: "Error",
        description: "Failed to load chat",
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
          model: 'groq',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <Card>
          {/* Mobile Menu Button */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="space-y-4">
                  <ChatHistory
                    sessions={chatHistory}
                    selectedId={currentChatId}
                    onSelect={setCurrentChatId}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-8rem)]">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <div className="space-y-4">
                <ChatHistory
                  sessions={chatHistory}
                  selectedId={currentChatId}
                  onSelect={setCurrentChatId}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8">
              <div className="h-full flex flex-col">
                <Card className="p-4 mb-6">
                  <h2 className="font-semibold mb-4">Company News</h2>
                  <CompanyNews />
                </Card>
                
                <Card className="flex-1">
                  <ChatContainer
                    messages={messages}
                    onMessagesChange={setMessages}
                    chatId={currentChatId}
                    onNewChat={createNewChat}
                  />
                </Card>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <HubLinks />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyHub;