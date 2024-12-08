import { useState } from "react";
import { Eye, Upload, Camera, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FiveSVision = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

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

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadedUrls = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('five-s-images')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('five-s-images')
          .getPublicUrl(fileName);
          
        uploadedUrls.push(publicUrl);
      }
      
      return uploadedUrls;
    }
  });

  const analysisMutation = useMutation({
    mutationFn: async (imageUrls: string[]) => {
      const response = await fetch('/functions/v1/analyze-5s-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ imageUrls })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze images');
      }

      return response.json();
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 4) {
      toast({
        title: "Too many images",
        description: "Please select up to 4 images only",
        variant: "destructive"
      });
      return;
    }
    setImages(files);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Here you would typically open a modal with the camera stream
      // and allow the user to capture an image
      // For now, we'll just stop the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedWorkcenter || images.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a workcenter and upload images",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Upload images
      const imageUrls = await uploadMutation.mutateAsync(images);
      
      // Analyze images
      const analysis = await analysisMutation.mutateAsync(imageUrls);
      
      // Create evaluation
      const { data: evaluation, error: evalError } = await supabase
        .from('five_s_evaluations')
        .insert({
          workcenter_id: selectedWorkcenter,
          ...analysis
        })
        .select()
        .single();
        
      if (evalError) throw evalError;
      
      // Save image references
      const imagePromises = imageUrls.map(url => 
        supabase
          .from('evaluation_images')
          .insert({
            evaluation_id: evaluation.id,
            image_url: url,
            image_type: 'evaluation'
          })
      );
      
      await Promise.all(imagePromises);
      
      toast({
        title: "Success",
        description: "5S evaluation completed successfully",
      });
      
      // Reset form
      setImages([]);
      setSelectedWorkcenter("");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete 5S evaluation",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
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
            disabled={!selectedWorkcenter || images.length === 0 || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Submit Evaluation'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FiveSVision;