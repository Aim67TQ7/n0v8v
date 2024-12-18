import { Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResourceLink {
  name: string;
  href: string;
}

const resourceLinks: ResourceLink[] = [
  { name: "Desktop", href: "company-resource://desktop" },
  { name: "Email", href: "company-resource://email" },
  { name: "Teams", href: "company-resource://teams" },
  { name: "Epicor", href: "company-resource://epicor" },
  { name: "Shared Folder", href: "company-resource://shared" },
  { name: "Windchill", href: "company-resource://windchill" },
];

export const ResourceLinks = () => {
  const navigate = useNavigate();

  const handleResourceClick = (href: string) => {
    switch (href) {
      case "company-resource://desktop":
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
        console.log('Opening shared folder');
        break;
      case "company-resource://windchill":
        console.log('Opening Windchill');
        break;
      default:
        if (!href.startsWith('company-resource://')) {
          navigate(href);
        }
    }
  };

  return (
    <div>
      <div className="space-y-1">
        {resourceLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleResourceClick(link.href)}
            className="block w-full text-xs text-gray-700 hover:text-black hover:bg-gray-100 py-0.5 px-2 rounded transition-colors text-left"
          >
            {link.name}
          </button>
        ))}
      </div>
    </div>
  );
};