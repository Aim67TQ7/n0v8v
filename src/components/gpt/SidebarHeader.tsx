import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export const SidebarHeader = ({ onNewChat }: SidebarHeaderProps) => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="border-b p-4 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/2c6383aa-9d2d-43af-9b0e-bd66dea3a1de.png" 
            alt="Logo" 
            className="h-6 w-auto"
          />
          <h2 className="text-lg font-semibold">GPT</h2>
        </div>
        <SidebarTrigger />
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            {session?.user?.email}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={onNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
};