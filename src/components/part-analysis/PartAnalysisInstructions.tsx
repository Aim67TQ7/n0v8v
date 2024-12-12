import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PartAnalysisInstructions = () => {
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        For best results, ensure your photo:
        <ul className="list-disc ml-6 mt-2">
          <li>Shows only the specific part or area to be analyzed</li>
          <li>Is well-lit and in focus</li>
          <li>Has minimal background clutter</li>
          <li>After uploading, select the specific area to analyze by dragging on the image</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};