import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

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
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing content
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    const svg = svgRef.current;
    const width = 1200;
    const height = 600;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Draw central spine
    const centerX = width / 2;
    const centerY = height / 2;
    const spineLength = width * 0.8;
    
    const spine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    spine.setAttribute('x1', String(centerX - spineLength/2));
    spine.setAttribute('y1', String(centerY));
    spine.setAttribute('x2', String(centerX + spineLength/2));
    spine.setAttribute('y2', String(centerY));
    spine.setAttribute('stroke', '#000');
    spine.setAttribute('stroke-width', '2');
    svg.appendChild(spine);

    // Add problem statement
    const problemText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    problemText.setAttribute('x', String(centerX + spineLength/2 + 10));
    problemText.setAttribute('y', String(centerY));
    problemText.setAttribute('dominant-baseline', 'middle');
    problemText.setAttribute('class', 'text-sm font-medium');
    problemText.textContent = 'Problem';
    svg.appendChild(problemText);

    // Draw categories and causes
    const categorySpacing = height / (analysis.categories.length + 1);
    analysis.categories.forEach((category, index) => {
      const isTop = index < analysis.categories.length / 2;
      const y = (index + 1) * categorySpacing;
      const branchLength = 150;
      const angle = isTop ? -45 : 45;
      const radians = angle * Math.PI / 180;

      // Draw category branch
      const branch = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      branch.setAttribute('x1', String(centerX));
      branch.setAttribute('y1', String(y));
      branch.setAttribute('x2', String(centerX + branchLength * Math.cos(radians)));
      branch.setAttribute('y2', String(y + branchLength * Math.sin(radians)));
      branch.setAttribute('stroke', '#000');
      branch.setAttribute('stroke-width', '1.5');
      svg.appendChild(branch);

      // Add category name
      const categoryText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      categoryText.setAttribute('x', String(centerX + (branchLength + 10) * Math.cos(radians)));
      categoryText.setAttribute('y', String(y + (branchLength + 10) * Math.sin(radians)));
      categoryText.setAttribute('class', 'text-sm font-medium');
      categoryText.textContent = category.name;
      svg.appendChild(categoryText);

      // Draw primary causes
      category.primaryCauses.forEach((cause, causeIndex) => {
        const causeX = centerX + (branchLength + 40 + causeIndex * 60) * Math.cos(radians);
        const causeY = y + (branchLength + 40 + causeIndex * 60) * Math.sin(radians);

        const causeLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        causeLine.setAttribute('x1', String(causeX - 20));
        causeLine.setAttribute('y1', String(causeY));
        causeLine.setAttribute('x2', String(causeX + 20));
        causeLine.setAttribute('y2', String(causeY));
        causeLine.setAttribute('stroke', getImpactColor(cause.impact));
        causeLine.setAttribute('stroke-width', '1.5');
        svg.appendChild(causeLine);

        const causeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        causeText.setAttribute('x', String(causeX));
        causeText.setAttribute('y', String(causeY - 10));
        causeText.setAttribute('text-anchor', 'middle');
        causeText.setAttribute('class', 'text-xs');
        causeText.textContent = truncateText(cause.cause, 20);
        svg.appendChild(causeText);
      });
    });
  }, [analysis]);

  const getImpactColor = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#22c55e";
      default:
        return "#000000";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <Button variant="outline" onClick={onReset}>
          New Analysis
        </Button>
      </div>

      <Card className="p-4 overflow-x-auto">
        <h3 className="font-semibold mb-4">Fishbone Diagram</h3>
        <svg
          ref={svgRef}
          className="w-full h-[600px] border border-gray-200 rounded-lg"
          preserveAspectRatio="xMidYMid meet"
        />
      </Card>

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