import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";

const CompanyHub = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-6 px-4 sm:px-6">
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