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
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">{title} ({japaneseTitle})</h3>
      
      {checklist?.length > 0 && (
        <div className="space-y-4 hidden">
          <ul className="list-disc pl-5 space-y-2">
            {checklist.map((item, index) => (
              <li key={index} className="text-sm">
                {item.item} - Score: {item.score}/10
                {item.description && (
                  <p className="text-muted-foreground mt-1">{item.description}</p>
                )}
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