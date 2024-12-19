import { Scale, Search, FileText } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { efficiencyTools } from "@/components/operations/modulesList";
import { ApiStatusIndicator } from "@/components/tools/ApiStatusIndicator";

const Tools = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Efficiency Tools</h1>
        <ApiStatusIndicator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {efficiencyTools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
          />
        ))}
        
        <ToolCard
          title="Lead Scraper"
          description="Automated lead generation tool for scraping business information from Google Maps"
          icon={Search}
          href="/leads/scraping/google-maps"
        />
        
        <ToolCard
          title="Market Research"
          description="Generate comprehensive market research reports with AI assistance"
          icon={FileText}
          href="/marketing/research"
        />
      </div>
    </div>
  );
};

export default Tools;