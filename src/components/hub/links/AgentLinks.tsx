import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentLink {
  name: string;
  href: string;
}

const agentLinks: AgentLink[] = [
  { name: "Riley (Conversation Bot)", href: "/agents/conversation" },
  { name: "Morgan (NLP - Tonality)", href: "/agents/nlp" },
  { name: "Quincy (Scraper)", href: "/agents/scraper" },
  { name: "Chip (Researcher)", href: "/agents/research" },
  { name: "Dexter (Data Analysis)", href: "/agents/analysis" },
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