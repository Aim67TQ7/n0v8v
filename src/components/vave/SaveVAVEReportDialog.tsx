import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaveVAVEReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workcenter: string;
  imageUrl: string;
  analysis: any;
  onSaveSuccess?: (reportId: string) => void;
}

export const SaveVAVEReportDialog = ({ 
  open, 
  onOpenChange, 
  workcenter,
  imageUrl,
  analysis,
  onSaveSuccess 
}: SaveVAVEReportDialogProps) => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('vave_analysis_reports')
        .insert({
          workcenter_id: workcenter,
          image_url: imageUrl,
          analysis_data: analysis,
          part_number: reportTitle, // Using part_number field for report title
          job_number: jobNumber,
          po_number: poNumber
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report Saved",
        description: "The VAVE analysis report has been saved successfully.",
      });
      
      if (onSaveSuccess && data) {
        onSaveSuccess(data.id);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: "Failed to save the report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save VAVE Analysis Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Title</label>
            <Input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Enter a descriptive title for this report"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Description</label>
            <Textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Enter a detailed description of the analysis"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Number (Optional)</label>
            <Input
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
              placeholder="Enter job number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">PO Number (Optional)</label>
            <Input
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Enter PO number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};