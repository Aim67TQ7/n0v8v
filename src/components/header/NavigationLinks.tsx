import { Link } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const NavigationLinks = () => {
  const { session } = useSessionContext();

  return (
    <nav className="flex items-center gap-6">
      {!session ? (
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Login
          </Link>
          <Link to="/reset-password" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Forgot Password?
          </Link>
        </div>
      ) : (
        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Dashboard
        </Link>
      )}
    </nav>
  );
};