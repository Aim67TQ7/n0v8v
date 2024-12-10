import { Microscope } from "lucide-react";

export const VAVEHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Microscope className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">VAVE Analysis</h1>
      </div>
    </div>
  );
};