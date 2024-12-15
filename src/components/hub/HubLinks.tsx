import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Folder, Grid, Wrench, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HubLinks = () => {
  const navigate = useNavigate();
  
  const sections = [
    {
      title: "Company Resources",
      icon: Folder,
      links: [
        { name: "Desktop", href: "#" },
        { name: "Email", href: "#" },
        { name: "Teams", href: "#" },
        { name: "Epicor", href: "#" },
        { name: "Shared Folder", href: "#" },
        { name: "Windchill", href: "#" },
      ]
    },
    {
      title: "Function Modules",
      icon: Grid,
      links: [
        { name: "HR Operations", href: "/operations/hr" },
        { name: "Engineering", href: "/operations/engineering" },
        { name: "Facilities", href: "/operations/facilities" },
        { name: "Quality", href: "/operations/quality" },
        { name: "Production", href: "/operations/production" },
      ]
    },
    {
      title: "Efficiency Tools",
      icon: Wrench,
      links: [
        { name: "5S Scoring", href: "/operations/lean/5s-vision" },
        { name: "Five Whys", href: "/operations/quality/five-whys" },
        { name: "PM Assist", href: "/operations/maintenance" },
        { name: "Lead Scraping", href: "/leads/scraping" },
        { name: "Fishbone Analysis", href: "/operations/quality/fishbone" },
      ]
    },
    {
      title: "Recent Files",
      icon: FileText,
      links: [
        { name: "Training Records", href: "/operations/hr/training-matrix" },
        { name: "Company Policies", href: "/operations/hr/handbook" },
      ]
    }
  ];

  return (
    <Card className="card h-[calc(100vh-8rem)] flex flex-col bg-white">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-semibold text-sm text-black">Quick Links</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              className="bg-white hover:bg-gray-50 cursor-pointer p-3 shadow-sm"
              onClick={() => section.title === "Company Resources" && navigate("/modules")}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <section.icon className="h-4 w-4 text-gray-700" />
                <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
              </div>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-xs text-gray-700 hover:text-black hover:bg-gray-100 py-0.5 px-2 rounded transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};