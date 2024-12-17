import { Card } from "@/components/ui/card";
import { AgentsList } from "@/components/agents/AgentsList";
import { AgentChat } from "@/components/agents/AgentChat";

const AgentsHub = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black pt-4">
      <div className="container mx-auto px-4">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-8rem)]">
            {/* Left Sidebar - Agents List */}
            <div className="md:col-span-3">
              <AgentsList />
            </div>

            {/* Main Content - Agent Chat */}
            <div className="md:col-span-9">
              <AgentChat />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgentsHub;