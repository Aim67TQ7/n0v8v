import { ChatHistory } from "./ChatHistory";
import { TrainingMaterials } from "./TrainingMaterials";

export const SidebarContent = () => {
  const handleSelect = (sessionId: string) => {
    console.log('Selected session:', sessionId);
  };

  return (
    <div className="h-full flex flex-col">
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