import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatHistory } from "@/components/hub/ChatHistory";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { HubLinks } from "@/components/hub/HubLinks";

const CompanyHub = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-2">
            <div className="space-y-6">
              <ChatHistory />
              
              <Card className="p-4">
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

          {/* Main Content */}
          <div className="col-span-8">
            <div className="space-y-6">
              <CompanyNews />
              
              <Card className="p-4">
                <h2 className="font-semibold mb-4">Active Chat</h2>
                <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
                  {/* Chat messages would go here */}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button>Send</Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-2">
            <HubLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHub;
