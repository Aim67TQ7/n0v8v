import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FiveSImageUploadProps {
  images: File[];
  onImageRemove: (index: number) => void;
}

export const FiveSImageUpload = ({ images, onImageRemove }: FiveSImageUploadProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onImageRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};