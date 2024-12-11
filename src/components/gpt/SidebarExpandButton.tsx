import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const SidebarExpandButton = () => {
  const { state, toggleSidebar } = useSidebar();

  if (state !== "collapsed") return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-r-lg border border-l-0"
      onClick={toggleSidebar}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};