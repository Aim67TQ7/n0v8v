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
        { name: "Company News", href: "/operations/hr/company-news" },
        { name: "Employee Data", href: "/operations/hr/employee-data" },
        { name: "Training Matrix", href: "/operations/hr/training-matrix" },
        { name: "Organization", href: "/operations/hr/org-chart" },
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
        { name: "Lead Scraping", href: "/leads/scraping" },
        { name: "Fishbone Analysis", href: "/operations/quality/fishbone" },
      ],
      onClick: () => navigate("/tools")
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
        <h2 className="font-semibold text-sm text-primary">Quick Links</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1.5">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              className={`content-area content-hover ${
                section.onClick ? 'cursor-pointer' : ''
              }`}
              onClick={section.onClick}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <section.icon className="h-4 w-4 text-secondary" />
                <h3 className="text-sm font-medium text-white">{section.title}</h3>
              </div>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-xs text-gray-300 hover:text-white py-0.5 px-2 rounded transition-colors"
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