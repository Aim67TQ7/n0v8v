import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaveReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processImprovementId?: string;
}

export const SaveReportDialog = ({ open, onOpenChange, processImprovementId }: SaveReportDialogProps) => {
  const [partNumber, setPartNumber] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('process_analysis_reports')
        .insert({
          process_improvement_id: processImprovementId,
          part_number: partNumber,
          job_number: jobNumber,
          po_number: poNumber,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Report Saved",
        description: "The analysis report has been saved successfully.",
      });
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
          <DialogTitle>Save Analysis Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Part Number</label>
            <Input
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="Enter part number"
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