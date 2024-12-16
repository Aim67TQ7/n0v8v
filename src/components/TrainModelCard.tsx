import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrainModelCardProps {
  toolType: string;
  resourceId: string;
  metadata?: Record<string, any>;
}

export const TrainModelCard = ({ toolType, resourceId, metadata }: TrainModelCardProps) => {
  const { toast } = useToast();
  const [trainingFeedback, setTrainingFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!resourceId || !trainingFeedback.trim()) return;

    try {
      setIsSubmitting(true);

      let fileUrl = '';
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `training/${toolType}/${resourceId}/${Date.now()}.${fileExt}`;

        // Upload file to Knowledge bucket
        const { error: uploadError } = await supabase.storage
          .from('Knowledge')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('Knowledge')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      // Save to learning_feedback table
      const { error: feedbackError } = await supabase
        .from('learning_feedback')
        .insert({
          tool_type: toolType,
          resource_id: resourceId,
          feedback: trainingFeedback,
          metadata: {
            ...metadata,
            attachment_url: fileUrl || null
          }
        });

      if (feedbackError) throw feedbackError;

      // Save to Knowledge bucket for future training
      const fileName = `training/${toolType}/${resourceId}/${Date.now()}.json`;
      const feedbackData = {
        tool_type: toolType,
        resource_id: resourceId,
        feedback: trainingFeedback,
        metadata: {
          ...metadata,
          attachment_url: fileUrl || null
        },
        timestamp: new Date().toISOString()
      };

      const { error: storageError } = await supabase.storage
        .from('Knowledge')
        .upload(fileName, JSON.stringify(feedbackData, null, 2));

      if (storageError) throw storageError;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping train the model.",
      });

      setTrainingFeedback("");
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card card-hover p-4">
      <h3 className="font-semibold mb-4 text-primary-content">Train the Model</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-secondary-content">
          Please provide feedback or documentation to improve the model's knowledge
        </p>
        
        <Textarea
          placeholder="Enter your feedback or context..."
          value={trainingFeedback}
          onChange={(e) => setTrainingFeedback(e.target.value)}
          className="content-area min-h-[100px]"
        />

        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {selectedFile ? selectedFile.name : "Attach Document"}
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmitFeedback}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};