interface FiveSFollowUpProps {
  followUpActions?: string[];
  recommendations?: string[];
}

export const FiveSFollowUp = ({ recommendations }: FiveSFollowUpProps) => {
  if (!recommendations?.length) return null;
  
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
      <ul className="list-disc pl-5 space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="text-sm">{rec}</li>
        ))}
      </ul>
    </section>
  );
};