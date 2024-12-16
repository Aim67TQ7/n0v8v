import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { ApiStatus } from "@/components/gpt/ApiStatus";
import { toast } from "sonner";

const AIStatus = () => {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      // This will trigger the status check in the ApiStatus component
      await window.dispatchEvent(new Event('checkStatus'));
      toast.success("Status check initiated");
    } catch (error) {
      console.error('Error triggering status check:', error);
      toast.error("Failed to initiate status check");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bot className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">AI Services Status</h1>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Check the operational status of all AI services
          </p>
          <Button 
            onClick={handleCheckStatus} 
            disabled={isChecking}
            className="min-w-[150px]"
          >
            {isChecking ? 'Checking...' : 'Check Status'}
          </Button>
        </div>

        <ApiStatus />
      </Card>
    </div>
  );
};

export default AIStatus;