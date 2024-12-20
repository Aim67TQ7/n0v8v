import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GitFork, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RootCauseAnalysis = () => {
  const tools = [
    {
      title: "Five Whys Analysis",
      description: "Iterative interrogative technique to explore cause-and-effect relationships",
      icon: GitFork,
      href: "/operations/quality/five-whys",
      features: [
        "Interactive questioning process",
        "Root cause identification",
        "Solution recommendations",
        "Collaborative analysis",
        "Progress tracking"
      ]
    },
    {
      title: "Fishbone Analysis",
      description: "Comprehensive cause and effect diagram for problem solving",
      icon: Fish,
      href: "/operations/quality/fishbone",
      features: [
        "Visual diagram creation",
        "Multiple category analysis",
        "Team collaboration",
        "Detailed reporting",
        "Historical tracking"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <GitFork className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Root Cause Analysis Tools</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            to={tool.href}
            className="transition-transform duration-200 hover:scale-105"
          >
            <Card className="p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <tool.icon className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-lg">{tool.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-lg">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="text-gray-600 text-lg">{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RootCauseAnalysis;