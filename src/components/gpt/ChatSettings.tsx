import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyId } from "@/hooks/useCompanyId";

export const ChatSettings = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const companyId = useCompanyId();

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !companyId) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${companyId}/logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);

      await supabase
        .from('company_details')
        .update({ logo_url: publicUrl })
        .eq('id', companyId);

      toast({
        title: "Success",
        description: "Company logo has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload company logo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5" />
        <h3 className="font-medium">Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Company Logo</h4>
          <Button
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Logo'}
          </Button>
          <input
            id="logo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Recommended size: 200x200px. Max size: 2MB
          </p>
        </div>
      </div>
    </Card>
  );
};