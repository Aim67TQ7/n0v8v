import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavigationLinks = ({ isBypassEnabled = false }) => {
  return (
    <nav className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Dashboard
        </Link>
        <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Admin Panel
        </Link>
        {isBypassEnabled && (
          <div className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            Maintenance Mode
          </div>
        )}
      </div>
    </nav>
  );
};