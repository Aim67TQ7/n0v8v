import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatHistory } from "@/components/hub/ChatHistory";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { HubLinks } from "@/components/hub/HubLinks";
import { HubCard } from "@/components/hub/HubCard";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const CompanyHub = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="space-y-4">
      <ChatHistory />
      
      <Card className="p-4 bg-white/90 backdrop-blur-sm">
        <h2 className="font-semibold mb-4">Train the Model</h2>
        <Textarea
          placeholder="Provide feedback, improve data, or report hallucinations..."
          className="mb-4 text-xs"
          rows={4}
        />
        <Button className="w-full">Submit Feedback</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <HubCard>
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <div className="h-full flex flex-col">
                <ChatHistory className="flex-grow" />
                <Card className="p-4 bg-white/90 backdrop-blur-sm mt-auto" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="font-semibold mb-4">Train the Model</h2>
                  <Textarea
                    placeholder="Provide feedback, improve data, or report hallucinations..."
                    className="mb-4 text-xs"
                    rows={4}
                  />
                  <Button className="w-full">Submit Feedback</Button>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8">
              <div className="h-full flex flex-col">
                <Card className="p-4 bg-white/90 backdrop-blur-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="font-semibold mb-4">Company News</h2>
                  <CompanyNews />
                </Card>
                
                <Card className="p-4 bg-white/90 backdrop-blur-sm mt-6" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h2 className="font-semibold mb-4">Active Chat</h2>
                  <div className="space-y-4 mb-4 h-[500px] overflow-y-auto">
                    {/* Chat messages would go here */}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="flex-1 text-xs"
                    />
                    <Button className="sm:w-auto">Send</Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <div className="h-full flex flex-col">
                <div className="flex-grow" />
                <HubLinks />
              </div>
            </div>
          </div>
        </HubCard>
      </div>
    </div>
  );
};

export default CompanyHub;