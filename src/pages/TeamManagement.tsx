import { ProfileDebug } from "@/components/ProfileDebug";
import { TeamActions } from "@/components/team/TeamActions";

const TeamManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Management</h1>
      <ProfileDebug />
      <TeamActions />
    </div>
  );
};

export default TeamManagement;