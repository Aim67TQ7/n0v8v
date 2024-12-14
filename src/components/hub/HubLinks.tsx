import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HubLinks = () => {
  const sections = [
    {
      title: "Company Resources",
      links: [
        { name: "Desktop", href: "/desktop" },
        { name: "Epicor", href: "/epicor" },
      ]
    },
    {
      title: "Function Modules",
      links: [
        { name: "Sales", href: "/sales" },
        { name: "Engineering", href: "/engineering" },
      ]
    },
    {
      title: "Efficiency Tools",
      links: [
        { name: "5S Scoring", href: "/5s-scoring" },
        { name: "Maintenance", href: "/maintenance" },
      ]
    },
    {
      title: "Recent Files",
      links: [
        { name: "Q4 Report.pdf", href: "/files/q4-report" },
        { name: "Project Timeline.xlsx", href: "/files/project-timeline" },
      ]
    }
  ];

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Hub Links</h2>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">{section.title}</h3>
            {section.links.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="w-full justify-start text-left"
                asChild
              >
                <Link to={link.href}>{link.name}</Link>
              </Button>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};