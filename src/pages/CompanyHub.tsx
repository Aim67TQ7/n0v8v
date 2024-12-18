import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";

const CompanyHub = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background/95 pt-6">
      <div className="container mx-auto px-4 h-full bg-[#403E43]">
        <Card className="p-4 h-full">
          <MobileMenu />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
            {/* Left Sidebar */}
            <div className="hidden md:block md:col-span-2 h-full overflow-hidden">
              <SidebarContent />
            </div>

            {/* Main Content */}
            <MainContent />

            {/* Right Sidebar */}
            <div className="hidden md:block md:col-span-2 h-full overflow-hidden">
              <HubLinks />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyHub;