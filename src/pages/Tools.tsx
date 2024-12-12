import { Scale } from "lucide-react";
import { ToolsGrid } from "@/components/tools/ToolsGrid";

const Tools = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Manufacturing Tools</h1>
      </div>
      <ToolsGrid />
    </div>
  );
};

export default Tools;