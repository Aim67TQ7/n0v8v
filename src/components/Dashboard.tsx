import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database,
  ChartBar,
  Building2,
  GraduationCap,
  MessageSquare
} from "lucide-react";
import { ModuleCard } from "./dashboard/ModuleCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const Dashboard = () => {
  const { session } = useSessionContext();
  
  // Add a query to fetch user profile for debugging
  const { data: profile, error: profileError } = useQuery({
    queryKey: ["debug-profile"],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log("No session user ID found");
        return null;
      }
      
      console.log("Fetching profile for user ID:", session.user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          company:companies(*)
        `)
        .eq("id", session.user.id)
        .single();
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (profileError) {
    console.error("Profile query error:", profileError);
  }

  const modules = [
    {
      title: "Team Management",
      description: "Manage your team and assignments",
      icon: Users,
      href: "/team",
      status: "ready" as const
    },
    {
      title: "Training Matrix",
      description: "Track employee training and certifications",
      icon: GraduationCap,
      href: "/training/matrix",
      status: "ready" as const
    },
    {
      title: "Company GPT",
      description: "Chat with your AI assistant",
      icon: MessageSquare,
      href: "/company-gpt",
      status: "ready" as const
    },
    {
      title: "Analytics",
      description: "Performance metrics and insights",
      icon: ChartBar,
      href: "/analytics",
      status: "coming-soon" as const
    },
    {
      title: "Data Management",
      description: "Manage and organize your data",
      icon: Database,
      href: "/data",
      status: "coming-soon" as const
    },
    {
      title: "Settings",
      description: "Configure your workspace",
      icon: Settings,
      href: "/settings",
      status: "coming-soon" as const
    },
    {
      title: "Operations",
      description: "Manage and optimize processes",
      icon: Building2,
      href: "/operations",
      status: "coming-soon" as const
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Modules</h2>
      <div className="grid grid-cols-1 gap-4">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </div>
    </div>
  );
};
