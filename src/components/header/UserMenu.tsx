import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Key, UserPlus, ChevronDown } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {session?.user?.email}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              DEMO Company
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {!session ? (
          <DropdownMenuItem onClick={() => navigate("/login")}>
            <User className="mr-2 h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={() => navigate("/change-password")}>
              <Key className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/invite")}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite Others</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};