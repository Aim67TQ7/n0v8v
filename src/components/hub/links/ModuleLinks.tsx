import { Grid } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleLink {
  name: string;
  href: string;
}

const moduleLinks: ModuleLink[] = [
  { name: "Lean", href: "/operations/lean/5s-vision" },
  { name: "Supply Chain", href: "/operations/supply-chain" },
  { name: "Marketing", href: "/marketing/research" },
  { name: "Inside Sales", href: "/leads/scraping/google-maps" },
  { name: "Compliance", href: "/operations/compliance" },
  { name: "HR Operations", href: "/operations/hr/company-news" },
  { name: "Engineering", href: "/operations/engineering" },
];

export const ModuleLinks = () => {
  return (
    <div>
      <Link to="/modules" className="flex items-center gap-2 text-gray-900 hover:text-black">
        <Grid className="h-4 w-4 text-gray-700" />
        <h3 className="text-sm font-medium">Modules</h3>
      </Link>
      <div className="space-y-1">
        {moduleLinks.map((link) => (
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