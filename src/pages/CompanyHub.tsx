import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatHistory } from "@/components/hub/ChatHistory";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { HubLinks } from "@/components/hub/HubLinks";
import { HubCard } from "@/components/hub/HubCard";

const CompanyHub = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="container mx-auto">
        <HubCard>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Sidebar - Full width on mobile, 2 cols on desktop */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <Card className="p-3 bg-white/90 backdrop-blur-sm">
                  <h2 className="font-semibold text-sm mb-3">Chat History</h2>
                  <ChatHistory />
                </Card>
                
                <Card className="p-4 bg-white/90 backdrop-blur-sm">
                  <h2 className="font-semibold mb-4">Train the Model</h2>
                  <Textarea
                    placeholder="Provide feedback, improve data, or report hallucinations..."
                    className="mb-4"
                    rows={4}
                  />
                  <Button className="w-full">Submit Feedback</Button>
                </Card>
              </div>
            </div>

            {/* Main Content - Full width on mobile, 8 cols on desktop */}
            <div className="md:col-span-8">
              <div className="space-y-6">
                <Card className="p-4 bg-white/90 backdrop-blur-sm">
                  <h2 className="font-semibold mb-4">Company News</h2>
                  <CompanyNews />
                </Card>
                
                <Card className="p-4 bg-white/90 backdrop-blur-sm">
                  <h2 className="font-semibold mb-4">Active Chat</h2>
                  <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
                    {/* Chat messages would go here */}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button className="sm:w-auto">Send</Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Sidebar - Full width on mobile, 2 cols on desktop */}
            <div className="md:col-span-2">
              <Card className="p-4 bg-white/90 backdrop-blur-sm">
                <HubLinks />
              </Card>
            </div>
          </div>
        </HubCard>
      </div>
    </div>
  );
};

export default CompanyHub;