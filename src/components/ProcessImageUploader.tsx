import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/utils/imageCompression";
import { ImageSelector } from "@/components/ImageSelector";

interface ProcessImageUploaderProps {
  imagePreview: string;
  onImageUpload: (file: File) => void;
  onAreaSelect: (area: { x: number; y: number; width: number; height: number } | null) => void;
  selectedArea: { x: number; y: number; width: number; height: number } | null;
}

export const ProcessImageUploader = ({
  imagePreview,
  onImageUpload,
  onAreaSelect,
  selectedArea,
}: ProcessImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        onImageUpload(compressedFile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive"
        });
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      document.getElementById('image-upload')?.click();
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCameraCapture}
        >
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      </div>

      <input
        id="image-upload"
        type="file"
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
      />

      {imagePreview && (
        <div className="relative">
          <ImageSelector
            imageUrl={imagePreview}
            onAreaSelect={onAreaSelect}
            selectedArea={selectedArea}
          />
          {!selectedArea && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="bg-white text-black px-6 py-3 rounded-lg shadow-lg text-center">
                <p className="font-medium">Click and drag to select area for analysis</p>
                <p className="text-sm text-gray-600 mt-1">Selection required for analysis</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};