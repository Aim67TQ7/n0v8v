import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Folder, Grid, Wrench, FileText } from "lucide-react";

export const HubLinks = () => {
  const sections = [
    {
      title: "Company Resources",
      icon: Folder,
      links: [
        { name: "Desktop", href: "/desktop" },
        { name: "Epicor", href: "/epicor" },
      ]
    },
    {
      title: "Function Modules",
      icon: Grid,
      links: [
        { name: "Sales", href: "/sales" },
        { name: "Engineering", href: "/engineering" },
      ]
    },
    {
      title: "Efficiency Tools",
      icon: Wrench,
      links: [
        { name: "5S Scoring", href: "/5s-scoring" },
        { name: "Maintenance", href: "/maintenance" },
      ]
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
    <Card className="p-4 bg-white/90 backdrop-blur-sm">
      <h2 className="font-semibold mb-4">Quick Links</h2>
      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="h-5 w-5 text-secondary" />
              <h3 className="text-xs font-medium text-gray-500">{section.title}</h3>
            </div>
            <div className="space-y-0">
              {section.links.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  className="w-full justify-start text-left h-6 text-xs py-0"
                  asChild
                >
                  <Link to={link.href}>{link.name}</Link>
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};