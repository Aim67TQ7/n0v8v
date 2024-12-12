import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Category {
  name: string;
  primaryCauses: {
    cause: string;
    impact: "High" | "Medium" | "Low";
    secondaryCauses: {
      cause: string;
      tertiaryCauses?: string[];
      evidence?: string;
    }[];
  }[];
}

interface FishboneResultsProps {
  analysis: {
    categories: Category[];
    summary: {
      criticalCauses: string[];
      patterns: string[];
      recommendations: string[];
      dataGaps: string[];
    };
  };
  onReset: () => void;
}

export const FishboneResults = ({ analysis, onReset }: FishboneResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <Button variant="outline" onClick={onReset}>
          New Analysis
        </Button>
      </div>

      {analysis.categories.map((category) => (
        <Card key={category.name} className="p-4">
          <h3 className="font-semibold text-lg mb-4">{category.name}</h3>
          <div className="space-y-4">
            {category.primaryCauses.map((cause, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{cause.cause}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    cause.impact === 'High' ? 'bg-red-100 text-red-800' :
                    cause.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {cause.impact} Impact
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {cause.secondaryCauses.map((secondary, sIndex) => (
                    <div key={sIndex} className="ml-4">
                      <p className="text-sm font-medium">{secondary.cause}</p>
                      {secondary.tertiaryCauses && secondary.tertiaryCauses.length > 0 && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {secondary.tertiaryCauses.map((tertiary, tIndex) => (
                            <li key={tIndex} className="text-sm text-muted-foreground">
                              • {tertiary}
                            </li>
                          ))}
                        </ul>
                      )}
                      {secondary.evidence && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          Evidence: {secondary.evidence}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">Analysis Summary</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Critical Causes</h4>
            <ul className="list-disc ml-4 space-y-1">
              {analysis.summary.criticalCauses.map((cause, index) => (
                <li key={index} className="text-sm">{cause}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Cross-Category Patterns</h4>
            <ul className="list-disc ml-4 space-y-1">
              {analysis.summary.patterns.map((pattern, index) => (
                <li key={index} className="text-sm">{pattern}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Recommended Focus Areas</h4>
            <ul className="list-disc ml-4 space-y-1">
              {analysis.summary.recommendations.map((rec, index) => (
                <li key={index} className="text-sm">{rec}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Data Gaps</h4>
            <ul className="list-disc ml-4 space-y-1">
              {analysis.summary.dataGaps.map((gap, index) => (
                <li key={index} className="text-sm">{gap}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};