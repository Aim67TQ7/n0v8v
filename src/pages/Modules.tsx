import { Factory } from "lucide-react";
import { ModulesList } from "@/components/operations/ModulesList";

const Modules = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Factory className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Modules</h1>
      </div>
      
      <ModulesList />
    </div>
  );
};

export default Modules;