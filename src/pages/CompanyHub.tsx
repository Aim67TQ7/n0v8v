import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";
import { HubCard } from "@/components/hub/HubCard";

const CompanyHub = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-6 bg-background/95">
      <HubCard>
        <MobileMenu />
        <div className="absolute inset-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2 h-full">
              <Card className="h-full p-6 bg-white">
                <SidebarContent />
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8 h-full">
              <Card className="h-full p-6 bg-white">
                <MainContent />
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2 h-full">
              <Card className="h-full p-6 bg-white">
                <HubLinks />
              </Card>
            </div>
          </div>
        </div>
      </HubCard>
    </div>
  );
};

export default CompanyHub;