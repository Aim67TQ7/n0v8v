import { useState } from "react";
import { Eye, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FiveSVision = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);

  const { data: workcenters, isLoading } = useQuery({
    queryKey: ['workcenters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workcenters')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 4) {
      alert("Please select up to 4 images only");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async () => {
    if (!selectedWorkcenter || images.length === 0) {
      alert("Please select a workcenter and upload images");
      return;
    }

    // TODO: Implement image upload and Anthropic Vision analysis
    console.log("Submitting evaluation...");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">5S Vision Evaluation</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Workcenter</label>
            <Select value={selectedWorkcenter} onValueChange={setSelectedWorkcenter}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a workcenter" />
              </SelectTrigger>
              <SelectContent>
                {workcenters?.map((wc) => (
                  <SelectItem key={wc.id} value={wc.id}>
                    {wc.name} - {wc.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Images (up to 4)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF, TIFF, HEIC or HEIF (MAX. 4 files)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/tiff,image/heic,image/heif"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedWorkcenter || images.length === 0}
            className="w-full"
          >
            Submit Evaluation
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FiveSVision;