import { ModuleCard } from "./ModuleCard";
import { customerFocusTools } from "./modulesList";
import { Users, Search } from "lucide-react";

export const CustomerFocusTools = () => {
  return (
    <>
      <div className="flex items-center gap-3 my-8">
        <Users className="h-8 w-8 text-secondary" />
        <h2 className="text-2xl font-bold">Customer Focus Tools</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {customerFocusTools.map((tool) => (
          <ModuleCard key={tool.title} {...tool} />
        ))}
      </div>
    </>
  );
};