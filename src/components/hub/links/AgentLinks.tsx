import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentLink {
  name: string;
  href: string;
}

const agentLinks: AgentLink[] = [
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
];

export const AgentLinks = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-gray-700" />
        <h3 className="text-sm font-medium text-gray-900">Agents</h3>
      </div>
      <div className="space-y-1">
        {agentLinks.map((link) => (
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