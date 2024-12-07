import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const capabilities = [
  "Computer Vision for Quality Control",
  "Predictive Analytics",
  "Automated Reporting",
  "Process Optimization",
  "Defect Detection",
  "Performance Monitoring",
];

export const AICapabilities = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Advanced AI Capabilities</h2>
            <p className="text-xl text-gray-600 mb-8">
              Leverage cutting-edge artificial intelligence to transform your operations and drive efficiency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="text-secondary h-5 w-5" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-6 gradient-bg text-white">
            <h3 className="text-2xl font-semibold mb-4">Real-time Analysis</h3>
            <p className="mb-4">
              Our platform processes and analyzes data in real-time, providing immediate insights for quick decision-making.
            </p>
            <div className="aspect-video bg-white/10 rounded-lg"></div>
          </Card>
        </div>
      </div>
    </section>
  );
};