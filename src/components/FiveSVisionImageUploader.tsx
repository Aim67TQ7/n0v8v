import { Upload, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FiveSImageUpload } from "@/components/FiveSImageUpload";
import { compressImage } from "@/utils/imageCompression";

interface FiveSVisionImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
}

export const FiveSVisionImageUploader = ({ images, setImages }: FiveSVisionImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 4) {
      toast({
        title: "Too many images",
        description: "Please select up to 4 images only",
        variant: "destructive"
      });
      return;
    }

    try {
      const compressedFiles = await Promise.all(files.map(compressImage));
      setImages([...images, ...compressedFiles].slice(0, 4));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process images",
        variant: "destructive"
      });
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload or Take Photos (up to 4)</label>
      <div className="flex gap-4 mb-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Photos
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
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleImageUpload}
      />
      {images.length > 0 && (
        <FiveSImageUpload images={images} onImageRemove={handleImageRemove} />
      )}
    </div>
  );
};