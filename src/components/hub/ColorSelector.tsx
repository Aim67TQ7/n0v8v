import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const colorOptions = [
  // Vibrant Colors
  { name: "Primary Purple", value: "#9b87f5" },
  { name: "Vivid Purple", value: "#8B5CF6" },
  { name: "Ocean Blue", value: "#0EA5E9" },
  { name: "Magenta Pink", value: "#D946EF" },
  { name: "Bright Orange", value: "#F97316" },
  
  // Pastel Colors
  { name: "Soft Green", value: "#F2FCE2" },
  { name: "Soft Purple", value: "#E5DEFF" },
  { name: "Soft Blue", value: "#D3E4FD" },
  { name: "Soft Pink", value: "#FFDEE2" },
  { name: "Soft Peach", value: "#FDE1D3" },
  
  // Neutral Colors
  { name: "Neutral Gray", value: "#8E9196" },
  { name: "Charcoal", value: "#403E43" },
  { name: "Cool Gray", value: "#aaadb0" },
  { name: "Silver Gray", value: "#9F9EA1" },
  { name: "Dark Charcoal", value: "#221F26" },
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
      <PopoverContent className="w-[280px] p-3">
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={cn(
                "w-10 h-10 rounded-full border transition-all hover:scale-110",
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