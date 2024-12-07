import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AICapabilities } from "@/components/AICapabilities";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <AICapabilities />
    </div>
  );
};

export default Index;