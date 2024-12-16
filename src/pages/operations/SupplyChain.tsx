import { 
  MessageSquare, 
  Globe, 
  ShieldCheck, 
  FileText, 
  Link2, 
  Scale,
  Database,
  TrendingUp,
  Truck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const supplyChainModules = [
  {
    title: "Supplier Communication",
    description: "Manage vendor relationships and expedited ordering processes",
    icon: MessageSquare,
    href: "/operations/supply-chain/communication",
    features: [
      "Real-time chat and notifications",
      "Order tracking and status updates",
      "Document sharing and collaboration",
      "Expedited order processing"
    ]
  },
  {
    title: "Global Supply Chain Monitoring",
    description: "Track disruptions and international trade regulations",
    icon: Globe,
    href: "/operations/supply-chain/monitoring",
    features: [
      "Disruption alerts and tracking",
      "Trade regulation updates",
      "Route optimization",
      "Risk assessment"
    ]
  },
  {
    title: "Vendor Management",
    description: "Approved vendor list and compliance tracking",
    icon: Database,
    href: "/operations/supply-chain/vendors",
    features: [
      "Vendor qualification process",
      "Performance metrics",
      "Compliance monitoring",
      "Contract management"
    ]
  },
  {
    title: "Quality Assurance",
    description: "Quality compliance and verification systems",
    icon: ShieldCheck,
    href: "/operations/supply-chain/quality",
    features: [
      "Quality metrics tracking",
      "Compliance documentation",
      "Audit management",
      "Corrective actions"
    ]
  },
  {
    title: "Risk Management",
    description: "Risk assessment and mitigation strategies",
    icon: FileText,
    href: "/operations/supply-chain/risk",
    features: [
      "Risk assessment reports",
      "Mitigation planning",
      "Insurance tracking",
      "Incident reporting"
    ]
  },
  {
    title: "Traceability",
    description: "End-to-end supply chain traceability",
    icon: Link2,
    href: "/operations/supply-chain/traceability",
    features: [
      "Product tracking",
      "Chain of custody",
      "Certification verification",
      "Audit trails"
    ]
  },
  {
    title: "Logistics Management",
    description: "Transportation and delivery optimization",
    icon: Truck,
    href: "/operations/supply-chain/logistics",
    features: [
      "Route optimization",
      "Carrier management",
      "Delivery tracking",
      "Cost analysis"
    ]
  },
  {
    title: "Inventory Analytics",
    description: "Dynamic inventory and demand analysis",
    icon: TrendingUp,
    href: "/operations/supply-chain/inventory",
    features: [
      "Stock level monitoring",
      "Demand forecasting",
      "Reorder point optimization",
      "Inventory turnover analysis"
    ]
  }
];

const SupplyChain = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Supply Chain Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supplyChainModules.map((module) => (
          <Link 
            key={module.title} 
            to={module.href}
            className="transition-transform duration-200 hover:scale-105"
          >
            <Card className="p-6 h-full">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <module.icon className="h-8 w-8 text-secondary shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 ml-4">
                  {module.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SupplyChain;