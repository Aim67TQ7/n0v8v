import { Home, Mail, Wrench } from "lucide-react";
import { ResourceCard } from "./ResourceCard";

export const ResourceSidebar = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:";
  };

  return (
    <div className="w-full p-4 space-y-3">
      <ResourceCard
        icon={Home}
        title="Home"
        description="Return to dashboard"
        href="/"
      />
      <ResourceCard
        icon={Mail}
        title="Email Client"
        description="Open email client"
        onClick={handleEmailClick}
      />
      <ResourceCard
        icon={Wrench}
        title="Tools"
        description="Access quality tools"
        href="/tools"
      />
    </div>
  );
};