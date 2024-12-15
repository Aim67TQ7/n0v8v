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
        { name: "Desktop", href: "/desktop" },
        { name: "Epicor", href: "/epicor" },
        { name: "Email", href: "/email" },
        { name: "Teams", href: "/teams" },
        { name: "Webex", href: "/webex" },
      ]
    },
    {
      title: "Function Modules",
      icon: Grid,
      links: [
        { name: "Sales", href: "/modules/sales" },
        { name: "Engineering", href: "/modules/engineering" },
        { name: "Facilities", href: "/modules/facilities" },
        { name: "Quality", href: "/modules/quality" },
        { name: "Production", href: "/modules/production" },
      ],
      onClick: () => navigate("/modules")
    },
    {
      title: "Efficiency Tools",
      icon: Wrench,
      links: [
        { name: "5S Scoring", href: "/operations/lean/5s-vision" },
        { name: "Five Whys", href: "/operations/quality/five-whys" },
        { name: "PM Assist", href: "/operations/maintenance" },
        { name: "Lead Scraping", href: "/leads/web-scraping" },
        { name: "Fishbone Analysis", href: "/operations/quality/fishbone" },
      ],
      onClick: () => navigate("/tools")
    },
    {
      title: "Recent Files",
      icon: FileText,
      links: [
        { name: "Q4 Report.pdf", href: "/files/q4-report" },
        { name: "Project Timeline.xlsx", href: "/files/project-timeline" },
      ]
    }
  ];

  return (
    <Card className="p-3 bg-white">
      <h2 className="font-semibold mb-2 text-sm text-primary">Quick Links</h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-1.5">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              className={`p-2 bg-white ${section.onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`}
              onClick={section.onClick}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <section.icon className="h-4 w-4 text-secondary" />
                <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
              </div>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-xs text-gray-700 hover:text-primary hover:bg-accent/50 py-0.5 px-2 rounded transition-colors"
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