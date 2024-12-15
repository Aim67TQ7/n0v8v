import { Card } from "@/components/ui/card";
import { ModuleCard } from "@/components/operations/ModuleCard";
import { hrTools } from "@/components/operations/hr/hrTools";

const HROperations = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">HR Operations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrTools.map((tool) => (
          <ModuleCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default HROperations;