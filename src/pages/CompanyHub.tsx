import { Card } from "@/components/ui/card";
import { HubLinks } from "@/components/hub/HubLinks";
import { SidebarContent } from "@/components/hub/SidebarContent";
import { MobileMenu } from "@/components/hub/layout/MobileMenu";
import { MainContent } from "@/components/hub/layout/MainContent";

const CompanyHub = () => {
  return (
    <div className="h-[750px] bg-background/95">
      <Card className="mx-auto max-w-[1400px] p-4 bg-black text-white h-[750px] relative">
        <MobileMenu />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 absolute inset-4">
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

          {/* Right Sidebar */}
          <div className="hidden md:block md:col-span-2 h-full">
            <Card className="h-full p-3 bg-white">
              <HubLinks />
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyHub;