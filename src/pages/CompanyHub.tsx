import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";

const CompanyHub = () => {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-background/95">
      <div className="container h-full mx-auto px-4 py-4">
        <Card className="h-full p-4">
          <MobileMenu />
          <div className="grid h-full grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2 overflow-hidden">
              <SidebarContent />
            </div>

            {/* Main Content */}
            <MainContent />

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2 overflow-hidden">
              <HubLinks />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyHub;