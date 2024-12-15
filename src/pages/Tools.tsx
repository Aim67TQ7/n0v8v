import { Scale } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { tools } from "@/components/tools/toolsList";

const Tools = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">AI and Automation Tools</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
          />
        ))}
      </div>
    </div>
  );
};

export default Tools;