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

  return (
    <Card className="p-6 transition-colors duration-300" style={{ backgroundColor: hubColor }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/9f8b4a02-e5ce-48c8-a7c6-3195ee5e8cdc.png" 
            alt="Company Logo" 
            className="h-12 w-12 object-contain bg-white rounded-full p-1"
          />
          <div className="text-white">
            <h2 className="text-xl font-semibold">Company Name</h2>
            <div className="text-sm opacity-90">
              <span>{format(currentDate, 'PPPP')}</span>
              <span className="mx-2">•</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
        <ColorSelector selectedColor={hubColor} onColorSelect={setHubColor} />
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
};