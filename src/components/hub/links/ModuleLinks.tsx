import { Grid } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleLink {
  name: string;
  href: string;
}

const moduleLinks: ModuleLink[] = [
  { name: "Engineering", href: "/operations/engineering" },
  { name: "Quality Control", href: "/operations/quality" },
  { name: "Production", href: "/operations/lean" },
  { name: "Supply Chain", href: "/operations/supply-chain" },
  { name: "Sales", href: "/operations/sales" },
  { name: "HR Operations", href: "/operations/hr" },
  { name: "Compliance", href: "/operations/compliance" },
  { name: "Facilities", href: "/operations/facilities" },
];

export const ModuleLinks = () => {
  return (
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
  );
};