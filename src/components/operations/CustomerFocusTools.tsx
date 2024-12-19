import { ModuleCard } from "./ModuleCard";
import { modulesList } from "./modulesList";
import { Users } from "lucide-react";

export const CustomerFocusTools = () => {
  // Filter modules related to customer focus
  const customerTools = modulesList.filter(module => 
    module.href.includes('customer-focus') || 
    module.href.includes('leads')
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {customerTools.map((tool) => (
          <ModuleCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};