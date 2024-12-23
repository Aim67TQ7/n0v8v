import { Link } from "react-router-dom";

interface ToolLink {
  name: string;
  href: string;
}

const toolLinks: ToolLink[] = [
  { name: "5S Scoring", href: "/operations/lean/5s-vision" },
  { name: "Five Whys", href: "/operations/quality/five-whys" },
  { name: "PM Assist", href: "/operations/maintenance" },
  { name: "Lead Scraping", href: "/leads/scraping/google-maps" },
  { name: "Part Analysis", href: "/operations/quality/part-analysis" },
];

export const ToolLinks = () => {
  return (
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
  );
};