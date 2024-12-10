import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { WorkcenterSelect } from "@/components/WorkcenterSelect";
import { ProcessImageUploader } from "@/components/ProcessImageUploader";
import { useToast } from "@/hooks/use-toast";

interface VAVEFormProps {
  onAnalyze: (data: {
    selectedWorkcenter: string;
    image: File;
    selectedArea: { x: number; y: number; width: number; height: number };
    valueChecks: {
      functionalImprovements: boolean;
      manufacturingOptimization: boolean;
      assemblyErgonomics: boolean;
      designOptimization: boolean;
      materialOptimization: boolean;
    };
  }) => Promise<void>;
}

export const VAVEForm = ({ onAnalyze }: VAVEFormProps) => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const [valueChecks, setValueChecks] = useState({
    functionalImprovements: false,
    manufacturingOptimization: false,
    assemblyErgonomics: false,
    designOptimization: false,
    materialOptimization: false,
  });

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSelectedArea(null);
  };

  const handleSubmit = async () => {
    if (!selectedWorkcenter || !image) {
      toast({
        title: "Missing information",
        description: "Please select a workcenter and upload an image",
        variant: "destructive"
      });
      return;
    }

    if (!selectedArea) {
      toast({
        title: "Area not selected",
        description: "Please click and drag on the image to select the specific area to analyze",
        variant: "destructive"
      });
      return;
    }

    if (!Object.values(valueChecks).some(Boolean)) {
      toast({
        title: "Value Analysis Required",
        description: "Please select at least one value analysis category",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await onAnalyze({
        selectedWorkcenter,
        image,
        selectedArea,
        valueChecks,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <WorkcenterSelect 
        value={selectedWorkcenter} 
        onChange={setSelectedWorkcenter} 
      />

      <div className="space-y-4">
        <h3 className="font-medium">Value Analysis Categories</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="functional" 
              checked={valueChecks.functionalImprovements}
              onCheckedChange={(checked) => 
                setValueChecks(prev => ({ ...prev, functionalImprovements: checked as boolean }))
              }
            />
            <label htmlFor="functional" className="text-sm">
              Functional Improvements
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="manufacturing" 
              checked={valueChecks.manufacturingOptimization}
              onCheckedChange={(checked) => 
                setValueChecks(prev => ({ ...prev, manufacturingOptimization: checked as boolean }))
              }
            />
            <label htmlFor="manufacturing" className="text-sm">
              Manufacturing Process Optimization
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="assembly" 
              checked={valueChecks.assemblyErgonomics}
              onCheckedChange={(checked) => 
                setValueChecks(prev => ({ ...prev, assemblyErgonomics: checked as boolean }))
              }
            />
            <label htmlFor="assembly" className="text-sm">
              Assembly and Ergonomics
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="design" 
              checked={valueChecks.designOptimization}
              onCheckedChange={(checked) => 
                setValueChecks(prev => ({ ...prev, designOptimization: checked as boolean }))
              }
            />
            <label htmlFor="design" className="text-sm">
              Design Optimization and Standardization
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="material" 
              checked={valueChecks.materialOptimization}
              onCheckedChange={(checked) => 
                setValueChecks(prev => ({ ...prev, materialOptimization: checked as boolean }))
              }
            />
            <label htmlFor="material" className="text-sm">
              Material and Thickness Optimization
            </label>
          </div>
        </div>
      </div>

      <div className="relative">
        <ProcessImageUploader
          imagePreview={imagePreview}
          onImageUpload={handleImageUpload}
          onAreaSelect={setSelectedArea}
          selectedArea={selectedArea}
        />
        {imagePreview && !selectedArea && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
              Click and drag to select area
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedWorkcenter || !image || isAnalyzing || !selectedArea}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Process...
          </>
        ) : (
          'Analyze Process'
        )}
      </Button>
    </div>
  );
};