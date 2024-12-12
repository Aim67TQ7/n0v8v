import { ModuleCard } from "./ModuleCard";
import { modulesList } from "./modulesList";

export const ModuleGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modulesList.map((module) => (
        <ModuleCard key={module.title} {...module} />
      ))}
    </div>
  );
};