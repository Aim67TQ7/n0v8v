import { Scale, MessageSquare, User, BookOpen, Mail, BarChart2, Globe } from "lucide-react";
import { ToolsGrid } from "@/components/tools/ToolsGrid";
import { customerFocusTools } from "@/components/operations/modulesList";
import { tools } from "@/components/tools/toolsList";

const Tools = () => {
  // Combine the existing tools with customer focus tools
  const allTools = [
    ...tools,
    ...customerFocusTools.map(tool => ({
      title: tool.title,
      description: tool.description,
      icon: tool.icon,
      href: tool.href
    }))
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Manufacturing Tools</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.title}
              className="block transition-transform duration-200 hover:scale-105"
            >
              <div className="p-6 h-full bg-white rounded-lg border shadow-sm">
                <div className="flex items-start gap-4">
                  <Icon className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{tool.title}</h3>
                    <p className="text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tools;