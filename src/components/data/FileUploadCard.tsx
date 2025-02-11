import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const FileUploadCard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionContext();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValid = file.type === 'application/pdf' || file.type === 'text/plain';
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF or text file`,
          variant: "destructive"
        });
      }
      return isValid;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user?.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('No company ID found');
      }

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('rag-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Process the document for RAG
        const { error: processError } = await supabase.functions
          .invoke('process-rag-document', {
            body: { 
              filePath,
              companyId: profile.company_id
            }
          });

        if (processError) throw processError;
      }

      toast({
        title: "Upload successful",
        description: "Your documents have been uploaded and processed successfully"
      });

      setFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your documents",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
             onClick={() => document.getElementById('file-upload')?.click()}>
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PDF and text documents only</p>
        </div>

        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileSelect}
        />

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleFileRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};