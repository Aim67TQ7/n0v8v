import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

interface CompanyDetails {
  name: string;
  gpt_name?: string;
  logo_url?: string;
}

export const SidebarHeader = ({ onNewChat }: SidebarHeaderProps) => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        if (!session?.user?.id) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (!profile?.company_id) {
          console.error('No company ID found for user');
          return;
        }

        const { data: details, error: detailsError } = await supabase
          .from('company_details')
          .select('name, gpt_name, logo_url')
          .eq('id', profile.company_id)
          .maybeSingle();

        if (detailsError) {
          console.error('Error fetching company details:', detailsError);
          return;
        }

        // If we have details, set them. Otherwise, use default values
        if (details) {
          setCompanyDetails(details);
        } else {
          // Set default values if no company details found
          setCompanyDetails({
            name: 'Company',
            gpt_name: 'Company Assistant',
            logo_url: undefined
          });
        }
      } catch (error) {
        console.error('Error in fetchCompanyDetails:', error);
        toast({
          title: "Error",
          description: "Failed to load company details",
          variant: "destructive"
        });
      }
    };

    fetchCompanyDetails();
  }, [session?.user?.id, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="border-b p-4 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {companyDetails?.logo_url && (
            <img 
              src={companyDetails.logo_url} 
              alt="Company Logo" 
              className="h-8 w-8 object-contain"
            />
          )}
          <h2 className="text-lg font-semibold">
            {companyDetails?.gpt_name || 'Company GPT'}
          </h2>
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