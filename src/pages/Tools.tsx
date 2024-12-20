import { Scale, Search, FileText, ChartBar, GraduationCap, Book, GitFork } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { modulesList } from "@/components/operations/modulesList";
import { ApiStatusIndicator } from "@/components/tools/ApiStatusIndicator";

const Tools = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Tools</h1>
        <ApiStatusIndicator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulesList.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
          />
        ))}
        
        <ToolCard
          title="Root Cause Analysis"
          description="Comprehensive tools for identifying and analyzing root causes of problems using Five Whys and Fishbone techniques"
          icon={GitFork}
          href="/operations/quality/root-cause-analysis"
        />
        
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

        <ToolCard
          title="Text Parser"
          description="Advanced text analysis and processing tool for document automation"
          icon={FileText}
          href="/tools/text-parser"
        />

        <ToolCard
          title="Stock Check"
          description="Real-time inventory monitoring and stock level analysis"
          icon={ChartBar}
          href="/tools/stock-check"
        />

        <ToolCard
          title="ABC Learning"
          description="Statistical model customization tool for optimizing AI performance to your specific use cases"
          icon={GraduationCap}
          href="/tools/abc-learning"
        />

        <ToolCard
          title="Part Trainer"
          description="Comprehensive training module for part identification and analysis"
          icon={Book}
          href="/tools/part-trainer"
        />
      </div>
    </div>
  );
};

export default Tools;