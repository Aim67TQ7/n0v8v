import { useState } from "react";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { SidebarHeader } from "@/components/gpt/SidebarHeader";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

const CompanyGPT = () => {
  const [selectedModel, setSelectedModel] = useState("groq");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  const handleStarterSelect = (prompt: string) => {
    setInputValue(prompt);
  };

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
              <div className="border-t p-4">
                <ConversationStarters onSelect={handleStarterSelect} />
              </div>
            </Sidebar>

            {/* Main Content - Scrollable */}
            <ChatContainer 
              selectedSession={selectedSession}
              chatSessions={chatSessions}
              onHistoryUpdate={() => {}}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            
            {/* Right Sidebar - Fixed */}
            <div className="w-64 border-l bg-white flex flex-col">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Demo User</span>
                  <span className="text-xs text-muted-foreground">DEMO Company</span>
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