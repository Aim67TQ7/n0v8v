import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";

const CompanyHub = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black pt-4">
      <div className="container mx-auto px-4">
        <Card>
          <MobileMenu />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-8rem)]">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <SidebarContent />
            </div>

            {/* Main Content */}
            <MainContent />

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2">
              <HubLinks />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyHub;