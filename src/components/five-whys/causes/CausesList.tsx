import { Checkbox } from "@/components/ui/checkbox";
import type { Cause } from "@/types/fishbone";

interface CausesListProps {
  causes: Cause[];
  onCauseToggle: (causeId: string, checked: boolean) => void;
}

export const CausesList = ({ causes, onCauseToggle }: CausesListProps) => {
  return (
    <div className="space-y-4">
      {causes.map((cause) => (
        <div key={cause.id} className="flex items-start space-x-2">
          <Checkbox
            id={cause.id}
            checked={cause.checked}
            onCheckedChange={(checked) => onCauseToggle(cause.id, checked as boolean)}
          />
          <label
            htmlFor={cause.id}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {cause.text}
          </label>
        </div>
      ))}
    </div>
  );
};