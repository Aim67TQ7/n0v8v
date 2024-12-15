import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatHistory } from "@/components/hub/ChatHistory";
import { CompanyNews } from "@/components/hub/CompanyNews";
import { HubLinks } from "@/components/hub/HubLinks";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const CompanyHub = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#9b87f5");

  const SidebarContent = () => (
    <div className="space-y-4">
      <ChatHistory />
      
      <Card className="p-4" style={{ backgroundColor }}>
        <h2 className="font-semibold mb-2">Train the Model</h2>
        <Textarea
          placeholder="Provide feedback, improve data, or report hallucinations..."
          className="mb-2 text-xs"
          rows={3}
        />
        <Button className="w-full">Submit Feedback</Button>
      </Card>
    </div>
  );

  // Function to determine if background is dark
  const isBackgroundDark = (color: string) => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  // Determine text color based on background
  const textColorClass = isBackgroundDark(backgroundColor) ? "text-white" : "text-gray-900";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="w-[100px] flex items-center gap-2"
            onClick={() => {
              const colorPicker = document.createElement('input');
              colorPicker.type = 'color';
              colorPicker.value = backgroundColor;
              colorPicker.addEventListener('change', (e) => {
                setBackgroundColor((e.target as HTMLInputElement).value);
              });
              colorPicker.click();
            }}
          >
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor }}
            />
            Color
          </Button>
        </div>

        <Card className={`${textColorClass}`} style={{ backgroundColor }}>
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
                <Card className="p-4 mt-4" style={{ backgroundColor }}>
                  <h2 className="font-semibold mb-2">Train the Model</h2>
                  <Textarea
                    placeholder="Provide feedback, improve data, or report hallucinations..."
                    className="mb-2 text-xs"
                    rows={3}
                  />
                  <Button className="w-full">Submit Feedback</Button>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8">
              <div className="h-full flex flex-col">
                <Card className="p-4" style={{ backgroundColor }}>
                  <h2 className="font-semibold mb-4">Company News</h2>
                  <CompanyNews />
                </Card>
                
                <Card className="p-4 mt-6 flex-1 relative" style={{ backgroundColor }}>
                  <h2 className="font-semibold mb-4">Active Chat</h2>
                  <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
                    {/* Chat messages would go here */}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 text-xs"
                      />
                      <Button className="sm:w-auto">Send</Button>
                    </div>
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
        </Card>
      </div>
    </div>
  );
};

export default CompanyHub;