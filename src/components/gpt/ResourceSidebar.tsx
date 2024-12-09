import { Building, Package, Settings } from "lucide-react";
import { ResourceCard } from "./ResourceCard";

export const ResourceSidebar = () => {
  return (
    <div className="w-64 space-y-4">
      <ResourceCard
        icon={Building}
        title="Open Epicor"
        description="Access ERP system"
        onClick={() => window.open('https://epicor.com', '_blank')}
      />
      <ResourceCard
        icon={Package}
        title="Modules"
        description="Access all modules"
        href="/modules"
      />
      <ResourceCard
        icon={Settings}
        title="Settings"
        description="Configure system settings"
        href="/settings"
      />
    </div>
  );
};