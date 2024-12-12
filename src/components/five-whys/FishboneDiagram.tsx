import { useEffect, useRef } from "react";

interface FishboneDiagramProps {
  data: string;
}

export const FishboneDiagram = ({ data }: FishboneDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Parse the fishbone data
    const lines = data.split('\n').filter(line => line.trim());
    const problem = lines[0].replace('Problem: ', '');
    const causes = lines.slice(2)
      .filter(line => line.includes('.'))
      .map(line => line.split('. ')[1]);

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw main spine
    ctx.beginPath();
    ctx.moveTo(50, canvas.height / 2);
    ctx.lineTo(canvas.width - 50, canvas.height / 2);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw problem statement
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText(problem, canvas.width - 250, canvas.height / 2 - 10);

    // Draw causes
    const spacing = (canvas.width - 100) / (causes.length + 1);
    causes.forEach((cause, index) => {
      const x = 75 + spacing * (index + 1);
      const y = canvas.height / 2;

      // Draw branch
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 40, y - 40);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw cause text
      ctx.save();
      ctx.translate(x + 45, y - 45);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(cause, 0, 0);
      ctx.restore();
    });

  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <canvas 
        ref={canvasRef}
        className="min-w-[800px] h-[400px]"
      />
    </div>
  );
};