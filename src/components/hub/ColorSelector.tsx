import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider"; 
import { cn } from "@/lib/utils";
import { useState } from "react";

const colorOptions = [
  // Primary Colors
  { name: "Primary Purple", value: "#9b87f5" },
  { name: "Secondary Purple", value: "#7E69AB" },
  { name: "Tertiary Purple", value: "#6E59A5" },
  { name: "Dark Purple", value: "#1A1F2C" },
  { name: "Light Purple", value: "#D6BCFA" },
  { name: "Vivid Purple", value: "#8B5CF6" },
  { name: "Magenta Pink", value: "#D946EF" },
  { name: "Bright Orange", value: "#F97316" },
  { name: "Ocean Blue", value: "#0EA5E9" },
  { name: "Bright Blue", value: "#1EAEDB" },
  { name: "Sky Blue", value: "#33C3F0" },
  { name: "Deep Blue", value: "#0FA0CE" },
];

interface ColorSelectorProps {
  selectedColor: string;
  selectedSecondaryColor: string;
  onColorSelect: (color: string) => void;
  onSecondaryColorSelect: (color: string, opacity?: number) => void;
}

export const ColorSelector = ({ 
  selectedColor, 
  selectedSecondaryColor,
  onColorSelect,
  onSecondaryColorSelect 
}: ColorSelectorProps) => {
  const [opacity, setOpacity] = useState(100);

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0];
    setOpacity(newOpacity);
    onSecondaryColorSelect("#FFFFFF", newOpacity);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[120px] flex items-center gap-2"
        >
          <div 
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
          Colors
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Primary Color</h4>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-8 h-8 rounded-full border transition-all hover:scale-110",
                    selectedColor === color.value && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => onColorSelect(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Card Transparency</h4>
            <Slider
              defaultValue={[100]}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={handleOpacityChange}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1 text-center">
              {opacity}%
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};