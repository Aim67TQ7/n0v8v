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
    <Card className="card h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg text-black">Quick Links</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              className="content-area content-hover cursor-pointer p-4"
              onClick={() => section.title === "Company Resources" && navigate("/modules")}
            >
              <div className="flex items-center gap-2 mb-2">
                <section.icon className="h-5 w-5 text-black" />
                <h3 className="text-lg font-medium text-black">{section.title}</h3>
              </div>
              <div className="space-y-1.5">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-base text-black hover:text-primary py-1 px-2 rounded transition-colors"
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