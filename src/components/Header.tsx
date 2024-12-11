import { ApiStatus } from "@/components/gpt/ApiStatus";
import { NavigationLinks } from "./header/NavigationLinks";
import { UserMenu } from "./header/UserMenu";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavigationLinks />
          <div className="flex items-center gap-6">
            <ApiStatus />
            <div className="flex items-center gap-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};