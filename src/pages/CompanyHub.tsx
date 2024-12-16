import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatHistory } from "@/components/hub/ChatHistory";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { HubLinks } from "@/components/hub/HubLinks";
import { Menu } from "lucide-react";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { TrainingMaterials } from "@/components/hub/TrainingMaterials";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CompanyHub = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user' as const, content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage("");

      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: [...messages, userMessage]
        }
      });

      if (error) throw error;

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.content[0].text 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
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
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-8rem)]">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <SidebarContent />
            </div>

            {/* Main Content */}
            <div className="md:col-span-8">
              <div className="h-full flex flex-col space-y-4">
                <Card className="p-4">
                  <h2 className="font-semibold mb-4">Company News</h2>
                  <CompanyNews />
                </Card>
                
                <Card className="p-4 flex-1 relative">
                  <div className="space-y-4 mb-4 h-[calc(100vh-24rem)] overflow-y-auto">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white ml-auto max-w-[80%]' 
                            : 'bg-muted max-w-[80%]'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 text-xs"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        className="sm:w-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send"}
                      </Button>
                    </form>
                  </div>
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
