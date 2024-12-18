import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";
import { HubCard } from "@/components/hub/HubCard";

const CompanyHub = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background/95">
      <HubCard>
        <MobileMenu />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <Card className="bg-white h-[calc(100vh-5.375rem)] sticky top-[4rem]">
                <SidebarContent />
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8">
              <Card className="bg-white h-[calc(100vh-5.375rem)] sticky top-[4rem]">
                <MainContent />
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <Card className="bg-white h-[calc(100vh-5.375rem)] sticky top-[4rem]">
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