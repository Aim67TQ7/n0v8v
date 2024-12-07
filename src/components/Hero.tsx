import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="gradient-bg min-h-[80vh] flex items-center text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI-Powered Operations Management Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Transform your operations with advanced computer vision and AI analytics
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};