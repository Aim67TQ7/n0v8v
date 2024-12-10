import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { SidebarHeader } from "@/components/gpt/SidebarHeader";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

const CompanyGPT = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("groq");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const { data: profile, error: profileError } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          company:companies(
            id,
            name,
            settings:company_settings(gpt_name)
          )
        `)
        .eq("id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
    retry: 1
  });

  useEffect(() => {
    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [profileError, toast]);

  const fetchChatHistory = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat history:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
        return;
      }

      const sessions = data.map(log => ({
        id: log.id,
        title: log.messages[1]?.content?.slice(0, 30) + "..." || "New Chat",
        timestamp: new Date(log.created_at)
      }));

      setChatSessions(sessions);
    } catch (error) {
      console.error('Error in fetchChatHistory:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [profile?.company_id]);

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground">You need to be signed in to use GPT.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <SidebarProvider>
          <div className="flex w-full h-full">
            {/* Left Sidebar - Fixed */}
            <Sidebar className="border-r w-64 flex flex-col">
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
            </Sidebar>

            {/* Main Content - Scrollable */}
            <ChatContainer 
              selectedSession={selectedSession}
              chatSessions={chatSessions}
              onHistoryUpdate={fetchChatHistory}
            />
            
            {/* Right Sidebar - Fixed */}
            <div className="w-64 border-l bg-white flex flex-col">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {profile?.company?.name || 'Loading...'}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ResourceSidebar />
              </div>
              <Card className="m-4 p-4">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </Card>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default CompanyGPT;