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

  const formatImprovement = (weakness: string) => {
    // Convert weakness into an encouraging improvement suggestion
    const suggestion = weakness
      .replace(/missing|lack of|no |poor/gi, "opportunity to add")
      .replace(/disorganized|messy/gi, "could be better organized with")
      .replace(/unclear|confusing/gi, "could be enhanced with clear");
    
    return `Consider implementing ${suggestion.toLowerCase()} to enhance workplace efficiency.`;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold text-green-600 mb-2">Positive Observations</h3>
        <p className="text-sm text-gray-600 mb-3">
          Notable examples of 5S excellence observed in the workspace:
        </p>
        {renderList(strengths)}
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-blue-600 mb-2">Improvement Opportunities</h3>
        <p className="text-sm text-gray-600 mb-3">
          Specific suggestions to enhance workplace organization and efficiency:
        </p>
        <ul className="list-disc pl-5 space-y-4">
          {(shouldShowAllWeaknesses ? weaknesses : filteredWeaknesses).map((weakness, index) => (
            <li key={index} className="text-sm text-gray-700">
              {formatImprovement(weakness)}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};