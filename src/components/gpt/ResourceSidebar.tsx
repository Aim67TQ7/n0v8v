import { Building, Package, Settings, Mail } from "lucide-react";
import { ResourceCard } from "./ResourceCard";

export const ResourceSidebar = () => {
  const openEmail = () => {
    window.location.href = "mailto:";
  };

  return (
    <div className="w-64 space-y-4">
      <ResourceCard
        icon={Building}
        title="Open Epicor"
        description="Access ERP system"
        onClick={() => window.open('https://epicor.com', '_blank')}
      />
      <ResourceCard
        icon={Mail}
        title="Email"
        description="Open email client"
        onClick={openEmail}
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