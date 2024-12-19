import { User, Wrench, ClipboardList, Package, TreePine } from "lucide-react";
import type { CauseCategory } from "@/types/fishbone";

const categoryIcons = {
  'Man': User,
  'Machine': Wrench,
  'Method': ClipboardList,
  'Material': Package,
  'Environment': TreePine
};

interface StepHeaderProps {
  category: CauseCategory;
  title: string;
  description: string;
  round: number;
}

export const StepHeader = ({ category, title, description, round }: StepHeaderProps) => {
  const Icon = categoryIcons[category];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="h-6 w-6 text-primary" />}
        <h2 className="text-xl font-semibold">
          {round === 1 ? 'Initial Analysis' : 'Detailed Analysis'}: {title}
        </h2>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
    </div>
  );
};