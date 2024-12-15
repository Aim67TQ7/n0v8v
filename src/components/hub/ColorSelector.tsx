import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface ColorSelectorProps {
  selectedColor: string;
  opacity: number;
  onColorSelect: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}

export const ColorSelector = ({ 
  selectedColor, 
  opacity,
  onColorSelect,
  onOpacityChange,
}: ColorSelectorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  const handleColorClick = () => {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = selectedColor;
    colorPicker.addEventListener('change', (e) => {
      onColorSelect((e.target as HTMLInputElement).value);
    });
    colorPicker.click();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dialRef.current) return;

    const dial = dialRef.current;
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = ((angle * 180) / Math.PI + 360) % 360;
    const opacity = Math.round((degrees / 360) * 100);

    onOpacityChange(opacity);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative w-16 h-16">
      {/* Transparency Dial */}
      <div 
        ref={dialRef}
        className="absolute inset-0 rounded-full border-4 border-transparent cursor-pointer"
        style={{
          background: `conic-gradient(from 0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.5) ${opacity}%, rgba(255,255,255,0.1) ${opacity}%, rgba(255,255,255,0.1))`,
        }}
        onMouseDown={handleMouseDown}
      />
      
      {/* Color Button */}
      <Button 
        onClick={handleColorClick}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-12 h-12 rounded-full p-0 border-2 border-white/20"
        )}
        style={{ backgroundColor: selectedColor }}
      />
    </div>
  );
};