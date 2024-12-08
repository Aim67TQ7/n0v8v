import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkcenterTab } from "@/components/team/WorkcenterTab";
import { EmployeeTab } from "@/components/team/EmployeeTab";

const TeamManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="workcenters">
        <TabsList>
          <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="workcenters">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Work Centers</h1>
          </div>
          <WorkcenterTab />
        </TabsContent>

        <TabsContent value="employees">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Employees</h1>
          </div>
          <EmployeeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;