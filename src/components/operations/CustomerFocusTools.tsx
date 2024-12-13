import { ModuleCard } from "./ModuleCard";
import { customerFocusTools } from "./modulesList";
import { Users } from "lucide-react";

export const CustomerFocusTools = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {customerFocusTools.map((tool) => (
          <ModuleCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};