import { Building, MessageSquare, FileText } from "lucide-react";
import { ResourceCard } from "./ResourceCard";

export const ResourceSidebar = () => {
  return (
    <div className="w-64 space-y-4">
      <ResourceCard
        icon={Building}
        title="Open Epicor"
        description="Access ERP system"
      />
      <ResourceCard
        icon={MessageSquare}
        title="Webpages"
        description="Internal resources"
      />
      <ResourceCard
        icon={FileText}
        title="Shared Folder"
        description="Access documents"
      />
    </div>
  );
};