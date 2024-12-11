import { useLocation } from "react-router-dom";
import { ApiStatus } from "@/components/gpt/ApiStatus";
import { NavigationLinks } from "./header/NavigationLinks";
import { UserMenu } from "./header/UserMenu";

export const Header = () => {
  const location = useLocation();
  const isGPTRoute = location.pathname === "/company-gpt";

  // Skip auth check if bypass is enabled
  const isBypassEnabled = localStorage.getItem('bypass_auth') === 'true';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavigationLinks isBypassEnabled={isBypassEnabled} />
          <div className="flex items-center gap-6">
            {!isGPTRoute && <ApiStatus />}
            <div className="flex items-center gap-4">
              {isBypassEnabled && (
                <div className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                  Maintenance Mode
                </div>
              )}
              {!isBypassEnabled && <UserMenu />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};