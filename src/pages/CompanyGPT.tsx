import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatInterface } from "@/components/gpt/ChatInterface";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
        .maybeSingle(); // Use maybeSingle() instead of single()
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
    retry: 1, // Only retry once to avoid too many retries if there's a persistent error
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

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground">You need to be signed in to use BuntingGPT.</p>
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
              <SidebarHeader className="border-b p-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/2c6383aa-9d2d-43af-9b0e-bd66dea3a1de.png" 
                      alt="Bunting Logo" 
                      className="h-6 w-auto"
                    />
                    <h2 className="text-lg font-semibold">BuntingGPT</h2>
                  </div>
                  <SidebarTrigger />
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 gap-2"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </SidebarHeader>
              <ScrollArea className="flex-1">
                <SidebarContent>
                  <ChatHistory
                    sessions={chatSessions}
                    onSelect={handleSessionSelect}
                    selectedId={selectedSession}
                  />
                </SidebarContent>
              </ScrollArea>
            </Sidebar>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                {!selectedSession && !chatSessions.length ? (
                  <div className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1">
                      <Card className="m-4 flex items-center justify-center">
                        <ConversationStarters onSelect={(prompt) => {
                          const chatInterface = document.querySelector('textarea');
                          if (chatInterface) {
                            (chatInterface as HTMLTextAreaElement).value = prompt;
                          }
                        }} />
                      </Card>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <ChatInterface 
                        systemPrompt={`You are BuntingGPT, an AI assistant specialized in magnetic separation and metal detection solutions.`}
                        onHistoryUpdate={fetchChatHistory}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <ChatInterface 
                      systemPrompt={`You are BuntingGPT, an AI assistant specialized in magnetic separation and metal detection solutions.`}
                      onHistoryUpdate={fetchChatHistory}
                    />
                  </div>
                )}
              </div>
              
              {/* Right Sidebar - Fixed */}
              <div className="w-64 border-l bg-white flex flex-col">
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
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default CompanyGPT;