import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Bell,
  Briefcase,
  ChartBar,
  Globe,
  Mail,
  Settings,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyHub = () => {
  const navigate = useNavigate();
  const [announcements] = useState([
    { id: 1, title: "Company Meeting", content: "All-hands meeting this Friday at 2 PM" },
    { id: 2, title: "New Project Launch", content: "Project Phoenix kicks off next week" },
    { id: 3, title: "Holiday Schedule", content: "Updated holiday calendar now available" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Company Info */}
          <div className="col-span-3">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Company Overview
              </h2>
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <img 
                    src="/lovable-uploads/9f8b4a02-e5ce-48c8-a7c6-3195ee5e8cdc.png" 
                    alt="Company Logo" 
                    className="h-24 w-24 mx-auto mb-4"
                  />
                  <h3 className="font-semibold">DEMO Company</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Employees: 150</p>
                  <p className="text-sm text-gray-600">Location: Austin, TX</p>
                  <p className="text-sm text-gray-600">Founded: 2020</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  New Message
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Create Document
                </Button>
              </div>
            </Card>
          </div>

          {/* Middle Column - Main Content */}
          <div className="col-span-6">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Company Announcements
              </h2>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="p-4">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-gray-600">{announcement.content}</p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Team Meeting</p>
                      <p className="text-sm text-gray-600">Today, 2:00 PM</p>
                    </div>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Project Review</p>
                      <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
                    </div>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ChartBar className="h-5 w-5 text-primary" />
                  Key Metrics
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Active Projects</p>
                    <p className="text-2xl font-semibold">12</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Team Performance</p>
                    <p className="text-2xl font-semibold">94%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Team & Resources */}
          <div className="col-span-3">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Members
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-600">Project Manager</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white">
                    AS
                  </div>
                  <div>
                    <p className="font-medium">Alice Smith</p>
                    <p className="text-sm text-gray-600">Developer</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  View All Members
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Quick Links
              </h2>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/company-gpt")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Company GPT
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  Inbox
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHub;