import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const colorOptions = [
  { name: "Neutral Gray", value: "#8E9196" },
  { name: "Primary Purple", value: "#9b87f5" },
  { name: "Ocean Blue", value: "#0EA5E9" },
  { name: "Soft Green", value: "#F2FCE2" },
  { name: "Soft Purple", value: "#E5DEFF" },
  { name: "Soft Blue", value: "#D3E4FD" },
  { name: "Vivid Purple", value: "#8B5CF6" },
];

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorSelector = ({ selectedColor, onColorSelect }: ColorSelectorProps) => {
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
          Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <div className="grid grid-cols-4 gap-1">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={cn(
                "w-8 h-8 rounded-full border",
                selectedColor === color.value && "ring-2 ring-primary"
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorSelect(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};