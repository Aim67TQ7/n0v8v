import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolLink {
  name: string;
  href: string;
}

const toolLinks: ToolLink[] = [
  { name: "5S Scoring", href: "/operations/lean/5s-vision" },
  { name: "Five Whys", href: "/operations/quality/five-whys" },
  { name: "PM Assist", href: "/operations/maintenance" },
  { name: "Lead Scraping", href: "/leads/scraping" },
  { name: "Fishbone Analysis", href: "/operations/quality/fishbone" },
];

export const ToolLinks = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Wrench className="h-4 w-4 text-gray-700" />
        <h3 className="text-sm font-medium text-gray-900">Efficiency Tools</h3>
      </div>
      <div className="space-y-1">
        {toolLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className="block text-xs text-gray-700 hover:text-black hover:bg-gray-100 py-0.5 px-2 rounded transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};