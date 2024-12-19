import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

interface HubCardProps {
  children: React.ReactNode;
}

export const HubCard = ({ children }: HubCardProps) => {
  const [hubColor, setHubColor] = useState("#F1F0FB"); // Light gray color
  const [opacity, setOpacity] = useState(100);
  const { user } = useAuth();

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

  // Calculate the background color with opacity
  const backgroundColor = `${hubColor}${Math.round(opacity * 2.55).toString(16).padStart(2, '0')}`;

  return (
    <Card className="transition-colors duration-300" style={{ backgroundColor }}>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
};