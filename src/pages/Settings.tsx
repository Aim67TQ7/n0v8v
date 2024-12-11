import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPersonalitySettings } from "@/components/admin/AIPersonalitySettings";
import { ApiStatus } from "@/components/gpt/ApiStatus";
import { useAuth } from "@/contexts/AuthContext";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { profile } = useAuth();

  if (!profile || !['superadmin', 'admin', 'developer'].includes(profile.role)) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">You don't have access to this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <SettingsIcon className="h-8 w-8 text-gray-400" />
      </div>

      <Tabs defaultValue="api-status" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-status">API Status</TabsTrigger>
          <TabsTrigger value="ai-personalities">AI Personalities</TabsTrigger>
        </TabsList>

        <TabsContent value="api-status" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">API Status</h2>
            <div className="flex items-center gap-8">
              <ApiStatus />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai-personalities">
          <AIPersonalitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;