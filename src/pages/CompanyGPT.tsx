import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { SidebarHeader } from "@/components/gpt/SidebarHeader";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";
import { SidebarExpandButton } from "@/components/gpt/SidebarExpandButton";
import { useToast } from "@/components/ui/use-toast";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

const CompanyGPT = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("groq");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [inputValue, setInputValue] = useState("");
  const isBypassEnabled = localStorage.getItem('bypass_auth') === 'true';

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !isBypassEnabled,
  });

  useEffect(() => {
    // Only check auth if not in maintenance mode
    if (!isBypassEnabled) {
      if (!session) {
        navigate("/login");
        return;
      }

      if (!isLoading && profile) {
        const isAdmin = profile.role === "admin";
        const hasValidDemoAccess = profile.demo_access_expires && new Date(profile.demo_access_expires) > new Date();
        
        if (!isAdmin && !hasValidDemoAccess) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Your demo access has expired. Please contact support for full access.",
          });
          navigate("/");
        }
      }
    }
  }, [session, profile, isLoading, navigate, toast, isBypassEnabled]);

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  const handleStarterSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  if (isLoading && !isBypassEnabled) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <SidebarProvider>
          <div className="flex w-full h-full">
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
              <div className="border-t p-4">
                <ConversationStarters onSelect={handleStarterSelect} />
              </div>
            </Sidebar>

            <SidebarExpandButton />

            <div className="flex-1">
              <ChatContainer 
                selectedSession={selectedSession}
                chatSessions={chatSessions}
                onHistoryUpdate={() => {}}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            </div>
            
            <div className="w-64 border-l bg-white flex flex-col shrink-0 fixed right-0 h-[calc(100vh-64px)]">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-1">
                  {isBypassEnabled ? (
                    <span className="text-sm font-medium">Maintenance Mode</span>
                  ) : (
                    <>
                      <span className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {profile?.role === "admin" ? "Admin Access" : "Demo Access"}
                      </span>
                    </>
                  )}
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