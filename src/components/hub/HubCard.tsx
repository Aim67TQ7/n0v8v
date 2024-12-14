import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ColorSelector } from "./ColorSelector";

interface HubCardProps {
  children: React.ReactNode;
}

export const HubCard = ({ children }: HubCardProps) => {
  const [hubColor, setHubColor] = useState("#9b87f5");

  return (
    <Card className="p-6 transition-colors duration-300" style={{ backgroundColor: hubColor }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Company Hub</h2>
        <ColorSelector selectedColor={hubColor} onColorSelect={setHubColor} />
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
};