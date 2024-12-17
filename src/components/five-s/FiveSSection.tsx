import { ChecklistItem } from "@/types/five-s";

interface FiveSSectionProps {
  title: string;
  japaneseTitle: string;
  checklist?: ChecklistItem[];
  positiveObservations?: string[];
}

export const FiveSSection = ({ 
  title, 
  japaneseTitle, 
  checklist, 
  positiveObservations 
}: FiveSSectionProps) => {
  const formatScore = (score: number) => {
    const normalized = (score / 10).toFixed(1);
    return `${normalized}/1.0`;
  };

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">{title} ({japaneseTitle})</h3>
      
      {checklist?.length > 0 && (
        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            {checklist.map((item, index) => (
              <li key={index} className="text-sm flex justify-between items-baseline gap-2">
                <span>{item.item}</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatScore(item.score)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {positiveObservations?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium">Positive Observations</h4>
          <ul className="list-disc pl-5 space-y-2">
            {positiveObservations.map((obs, index) => (
              <li key={index} className="text-sm">{obs}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};