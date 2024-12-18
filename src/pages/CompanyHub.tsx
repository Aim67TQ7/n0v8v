import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";

const CompanyHub = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background/95 pt-6 pb-6">
      <Card className="mx-auto max-w-[1400px] p-6 bg-gray-50/95">
        <MobileMenu />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Sidebar */}
          <div className="hidden md:block md:col-span-2 h-full overflow-hidden">
            <Card className="h-full p-4 bg-white">
              <SidebarContent />
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 h-full">
            <Card className="h-full p-4 bg-white">
              <MainContent />
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block md:col-span-2 h-full overflow-hidden">
            <Card className="h-full p-4 bg-white">
              <HubLinks />
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyHub;