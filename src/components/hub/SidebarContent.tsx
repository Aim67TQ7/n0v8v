import { ChatHistory } from "./ChatHistory";
import { TrainingMaterials } from "./TrainingMaterials";

export const SidebarContent = () => {
  const handleSelect = (sessionId: string) => {
    console.log('Selected session:', sessionId);
  };

  return (
    <div className="flex flex-col h-auto">
      <ChatHistory 
        className="flex-grow" 
        onSelect={handleSelect}
        sessions={[]}
      />
      <div className="mt-4">
        <TrainingMaterials />
      </div>
    </div>
  );
};