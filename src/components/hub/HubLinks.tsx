import { Card } from "@/components/ui/card";
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
    <Card className="p-3 bg-white/90 backdrop-blur-sm">
      <h2 className="font-semibold mb-2 text-sm">Quick Links</h2>
      <div className="space-y-1.5">
        {sections.map((section) => (
          <Card key={section.title} className="p-2">
            <div className="flex items-center gap-1.5 mb-1">
              <section.icon className="h-4 w-4 text-secondary" />
              <h3 className="text-xs font-medium text-gray-500">{section.title}</h3>
            </div>
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-xs text-gray-600 hover:text-primary hover:underline py-0.5 px-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};