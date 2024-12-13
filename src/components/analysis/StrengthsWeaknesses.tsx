import { Card } from "@/components/ui/card";

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
  shouldShowAllWeaknesses: boolean;
  filteredWeaknesses: string[];
}

export const StrengthsWeaknesses = ({ 
  strengths, 
  weaknesses,
  shouldShowAllWeaknesses,
  filteredWeaknesses 
}: StrengthsWeaknessesProps) => {
  const renderList = (items: string[]) => (
    <ul className="list-disc pl-5 space-y-4">
      {items.map((item, index) => (
        <li key={index} className="text-sm">{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold text-green-600 mb-2">Observations & Strengths</h3>
        <p className="text-sm text-gray-600 mb-3">
          Document positive practices: organized workspaces, labeled storage, clean equipment,
          standardized procedures, and sustained improvements.
        </p>
        {renderList(strengths)}
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-red-600 mb-2">Areas for Improvement</h3>
        <p className="text-sm text-gray-600 mb-3">
          Each finding identifies a specific issue, its impact on operations,
          and provides a practical solution with expected benefits.
        </p>
        {renderList(shouldShowAllWeaknesses ? weaknesses : filteredWeaknesses)}
      </Card>
    </div>
  );
};