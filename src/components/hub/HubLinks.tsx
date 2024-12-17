import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Folder, Grid, Wrench, Bot, TruckIcon, Megaphone, Phone, FileText, Scale } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HubLinks = () => {
  const navigate = useNavigate();
  
  const handleResourceClick = (href: string) => {
    switch (href) {
      case "company-resource://desktop":
        // Simulate Windows+D keystroke (this will be handled by the desktop app)
        console.log('Desktop view requested');
        break;
      case "company-resource://email":
        window.location.href = "mailto:";
        break;
      case "company-resource://teams":
        window.location.href = "msteams://";
        break;
      case "company-resource://epicor":
        window.open('https://erp.bunting.com', '_blank');
        break;
      case "company-resource://shared":
        // Will be handled by desktop app
        console.log('Opening shared folder');
        break;
      case "company-resource://windchill":
        // Will be handled by desktop app
        console.log('Opening Windchill');
        break;
      default:
        if (!href.startsWith('company-resource://')) {
          navigate(href);
        }
    }
  };

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
      href: "/modules",
      links: [
        { name: "Lean", href: "/operations/lean" },
        { name: "Supply Chain", href: "/operations/supply-chain" },
        { name: "Marketing", href: "/marketing" },
        { name: "Inside Sales", href: "/sales" },
        { name: "Compliance", href: "/operations/compliance" },
        { name: "HR Operations", href: "/operations/hr" },
        { name: "Engineering", href: "/operations/engineering" },
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
      title: "Agents",
      icon: Bot,
      links: [
        { name: "Maggie (Inside Sales)", href: "/sales/research" },
        { name: "Faraday (Technical)", href: "/operations/engineering/research" },
        { name: "Magnus (Service)", href: "/operations/service/research" },
        { name: "Morgan (Complaints)", href: "/operations/complaints/resolution" },
        { name: "Alex (Cold Calls)", href: "/sales/cold-calls" },
        { name: "Riley (Market Research)", href: "/marketing/research" },
        { name: "Casey (VAVE Analysis)", href: "/operations/quality/vave" },
        { name: "Chip (Raw Data Analysis)", href: "/data/raw-analysis" },
        { name: "Quincy (Data Metrics)", href: "/data/metrics" },
        { name: "Dexter (Charts & Graphics)", href: "/data/visualizations" },
      ]
    }
  ];

  return (
    <Card className="card h-[calc(100vh-8rem)] flex flex-col bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              className="bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {section.href ? (
                  <Link 
                    to={section.href}
                    className="flex items-center gap-2 text-gray-900 hover:text-black"
                  >
                    <section.icon className="h-4 w-4 text-gray-700" />
                    <h3 className="text-sm font-medium">{section.title}</h3>
                  </Link>
                ) : (
                  <>
                    <section.icon className="h-4 w-4 text-gray-700" />
                    <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                  </>
                )}
              </div>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-xs text-gray-700 hover:text-black hover:bg-gray-100 py-0.5 px-2 rounded transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResourceClick(link.href);
                    }}
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