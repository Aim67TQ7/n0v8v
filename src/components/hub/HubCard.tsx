import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ColorSelector } from "./ColorSelector";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

interface HubCardProps {
  children: React.ReactNode;
}

export const HubCard = ({ children }: HubCardProps) => {
  const [hubColor, setHubColor] = useState("#9b87f5");
  const { user } = useAuth();
  const currentDate = new Date();

  // Function to determine if background is dark
  const isBackgroundDark = (color: string) => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  // Determine text color based on background
  const textColorClass = isBackgroundDark(hubColor) ? "text-white" : "text-gray-900";

  return (
    <Card className="p-6 transition-colors duration-300" style={{ backgroundColor: hubColor }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/9f8b4a02-e5ce-48c8-a7c6-3195ee5e8cdc.png" 
            alt="Company Logo" 
            className="h-12 w-12 object-contain bg-white rounded-full p-1"
          />
          <div className={textColorClass}>
            <h2 className="text-xl font-semibold">Company Name</h2>
            <div className="opacity-90">
              <span>{format(currentDate, 'PPPP')}</span>
              <span className="mx-2">•</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
        <ColorSelector 
          selectedColor={hubColor}
          onColorSelect={setHubColor}
        />
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
};