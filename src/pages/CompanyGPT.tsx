import { useState, useEffect } from "react";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { SidebarHeader } from "@/components/gpt/SidebarHeader";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  company_id: string;
  company: {
    name: string;
  };
}

const CompanyGPT = () => {
  const [selectedModel, setSelectedModel] = useState("groq");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          role,
          company_id,
          company:companies(name)
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive"
        });
        return;
      }

      setUserProfile(profile);
    };

    fetchUserProfile();
  }, [toast]);

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  const handleStarterSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  const toggleLeftColumn = () => {
    setIsLeftColumnCollapsed(!isLeftColumnCollapsed);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <SidebarProvider>
          <div className="flex w-full h-full">
            {/* Left Sidebar with collapse/expand functionality */}
            <div className={`relative transition-all duration-300 ${isLeftColumnCollapsed ? 'w-0' : 'w-64'}`}>
              <Sidebar className="border-r flex flex-col">
                <SidebarHeader onNewChat={handleNewChat} />
                <ScrollArea className="flex-1">
                  <SidebarContent>
                    <ChatHistory
                      sessions={chatSessions}
                      onSelect={setSelectedSession}
                      selectedId={selectedSession}
                    />
                  </SidebarContent>
                </ScrollArea>
                <div className="border-t p-4">
                  <ConversationStarters onSelect={handleStarterSelect} />
                </div>
              </Sidebar>
              
              {/* Collapse/Expand Button - Repositioned */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-6 top-3 z-50 bg-white border shadow-sm hover:bg-gray-100"
                onClick={toggleLeftColumn}
                title={isLeftColumnCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isLeftColumnCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            <ChatContainer 
              selectedSession={selectedSession}
              chatSessions={chatSessions}
              onHistoryUpdate={() => {}}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            
            <div className="w-64 border-l bg-white flex flex-col">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {userProfile?.email || 'Loading...'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userProfile?.company?.name || 'Loading...'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    Role: {userProfile?.role || 'Loading...'}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ResourceSidebar />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default CompanyGPT;