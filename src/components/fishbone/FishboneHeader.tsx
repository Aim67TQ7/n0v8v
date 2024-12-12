import { Fish } from "lucide-react";

export const FishboneHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Fish className="h-8 w-8 text-secondary" />
      <h1 className="text-3xl font-bold">Fishbone Analysis</h1>
    </div>
  );
};