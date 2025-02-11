import { ModuleCard } from "@/components/operations/ModuleCard";
import { hrTools } from "@/components/operations/hr/hrTools";
import { Newspaper, UserSearch } from "lucide-react";

const HROperations = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">HR Operations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          title="Candidate Analysis"
          description="AI-powered candidate assessment and analysis tool"
          icon={UserSearch}
          href="/tools/candidate-analysis"
          status="ready"
        />
        <ModuleCard
          title="Company News"
          description="Manage and publish company announcements and updates"
          icon={Newspaper}
          href="/operations/hr/company-news"
          status="ready"
        />
        {hrTools.map((tool) => (
          <ModuleCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default HROperations;