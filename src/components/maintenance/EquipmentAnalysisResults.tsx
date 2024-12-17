import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";

interface EquipmentAnalysisResultsProps {
  results: {
    manualUrl?: string;
    manufacturerInfo?: {
      name: string;
      website: string;
      support?: string;
    };
    equipment?: {
      make: string;
      model: string;
      type: string;
      specifications?: any;
    };
    maintenanceSchedule?: any;
    alternativeResources?: string[];
  } | null;
  onViewSchedule?: () => void;
}

export const EquipmentAnalysisResults = ({ results, onViewSchedule }: EquipmentAnalysisResultsProps) => {
  if (!results) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
      
      <div className="space-y-6">
        {results.equipment && (
          <div>
            <h3 className="text-md font-medium mb-2">Identified Equipment</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Make:</span> {results.equipment.make}</p>
              <p><span className="font-medium">Model:</span> {results.equipment.model}</p>
              <p><span className="font-medium">Type:</span> {results.equipment.type}</p>
            </div>
          </div>
        )}

        {results.manualUrl && (
          <div>
            <h3 className="text-md font-medium mb-2">Equipment Manual</h3>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(results.manualUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Manual (PDF)
            </Button>
          </div>
        )}

        {results.manufacturerInfo && (
          <div>
            <h3 className="text-md font-medium mb-2">Manufacturer Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {results.manufacturerInfo.name}</p>
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => window.open(results.manufacturerInfo.website, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Manufacturer Website
              </Button>
              {results.manufacturerInfo.support && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(results.manufacturerInfo.support, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              )}
            </div>
          </div>
        )}

        {results.alternativeResources && results.alternativeResources.length > 0 && (
          <div>
            <h3 className="text-md font-medium mb-2">Additional Resources</h3>
            <div className="space-y-2">
              {results.alternativeResources.map((url, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Resource {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full"
          onClick={onViewSchedule}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Maintenance Schedule
        </Button>
      </div>
    </Card>
  );
};