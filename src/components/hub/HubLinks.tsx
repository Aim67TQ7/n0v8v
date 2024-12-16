import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Folder, Grid, Wrench } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HubLinks = () => {
  const navigate = useNavigate();
  
  const sections = [
    {
      title: "Resources",
      icon: Folder,
      links: [
        { name: "Desktop", href: "company-resource://desktop" },
        { name: "Email", href: "company-resource://email" },
        { name: "Teams", href: "company-resource://teams" },
        { name: "Epicor", href: "company-resource://epicor" },
        { name: "Shared Folder", href: "company-resource://shared" },
        { name: "Windchill", href: "company-resource://windchill" },
      ]
    },
    {
      title: "Modules",
      icon: Grid,
      links: [
        { name: "Company Resources", href: "/modules" },
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
    }
  ];

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('company-resource://')) {
      e.preventDefault();
      console.log('Electron will handle:', href);
    }
  };

  return (
    <Card className="card h-[calc(100vh-8rem)] flex flex-col bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              className="bg-white hover:bg-gray-50 cursor-pointer p-3 shadow-sm"
              onClick={() => section.title === "Resources" && navigate("/modules")}
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
                    onClick={(e) => handleLinkClick(link.href, e)}
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