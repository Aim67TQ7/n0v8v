interface FiveSFollowUpProps {
  followUpActions?: string[];
  recommendations?: string[];
}

export const FiveSFollowUp = ({ followUpActions, recommendations }: FiveSFollowUpProps) => {
  if (!followUpActions?.length && !recommendations?.length) return null;
  
  return (
    <>
      {followUpActions?.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Follow-up Actions</h3>
          <ul className="list-disc pl-5 space-y-2">
            {followUpActions.map((action, index) => (
              <li key={index} className="text-sm">{action}</li>
            ))}
          </ul>
        </section>
      )}

      {recommendations?.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};