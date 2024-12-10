import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const VAVEInstructions = () => {
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        For best results:
        <ul className="list-disc ml-6 mt-2">
          <li>Upload a clear, well-lit photo of the specific part or assembly</li>
          <li className="font-medium text-primary">Click and drag on the image to select the specific area you want to analyze</li>
          <li>Select at least one value analysis category below</li>
          <li>Ensure minimal background clutter in the photo</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};