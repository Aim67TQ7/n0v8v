import { useState, useEffect, useRef } from 'react';

interface ImageSelectorProps {
  imageUrl: string;
  onAreaSelect: (area: { x: number; y: number; width: number; height: number } | null) => void;
  selectedArea: { x: number; y: number; width: number; height: number } | null;
}

export const ImageSelector = ({ imageUrl, onAreaSelect, selectedArea }: ImageSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDragging(true);
    onAreaSelect(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    
    setCurrentPos({ x, y });
    
    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);
    const selectionX = Math.min(x, startPos.x);
    const selectionY = Math.min(y, startPos.y);
    
    onAreaSelect({
      x: selectionX / rect.width,
      y: selectionY / rect.height,
      width: width / rect.width,
      height: height / rect.height
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-48 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <img
        src={imageUrl}
        alt="Process preview"
        className="w-full h-full object-cover rounded-lg"
      />
      {selectedArea && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/20"
          style={{
            left: `${selectedArea.x * 100}%`,
            top: `${selectedArea.y * 100}%`,
            width: `${selectedArea.width * 100}%`,
            height: `${selectedArea.height * 100}%`,
          }}
        />
      )}
    </div>
  );
};