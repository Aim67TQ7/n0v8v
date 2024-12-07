import { Brain, BarChart3, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced computer vision for quality control and process optimization",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Instant insights and predictive analytics for better decision making",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Multi-tenant architecture with robust security controls",
  },
  {
    icon: Zap,
    title: "Process Automation",
    description: "Streamline operations with intelligent automation workflows",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};