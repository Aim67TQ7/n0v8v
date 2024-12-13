import { Card } from "@/components/ui/card";
import { Users2 } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/team" className="block transition-transform duration-200 hover:scale-105">
          <Card className="p-6 h-full">
            <div className="flex items-start gap-4">
              <Users2 className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Team Management</h3>
                <p className="text-muted-foreground mt-1">Manage your organization's team members and roles</p>
              </div>
            </div>
          </Card>
        </Link>
        {/* Additional settings cards can be added here */}
      </div>
    </div>
  );
};

export default Settings;