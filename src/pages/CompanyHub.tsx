import { Card } from "@/components/ui/card";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";
import { HubCard } from "@/components/hub/HubCard";

const CompanyHub = () => {
  return (
    <div className="h-[800px] bg-background/95">
      <HubCard>
        <MobileMenu />
        <div className="absolute inset-4">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4 h-full">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2 h-full">
              <Card className="h-full p-3 bg-white">
                <SidebarContent />
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8 h-full">
              <Card className="h-full p-3 bg-white">
                <MainContent />
              </Card>
            </div>
          </div>
        </div>
      </HubCard>
    </div>
  );
};

export default CompanyHub;