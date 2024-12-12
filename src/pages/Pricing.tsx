import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users away from pricing
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const plans = [
    {
      name: "Basic",
      price: "99",
      features: [
        "Up to 5 users",
        "Basic AI assistance",
        "Standard support",
        "Core modules access",
        "7-day free trial"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "199",
      features: [
        "Up to 15 users",
        "Advanced AI features",
        "Priority support",
        "All modules access",
        "Custom integrations",
        "Training sessions"
      ],
      popular: true,
      cta: "Contact Sales"
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited users",
        "Custom AI models",
        "24/7 dedicated support",
        "All modules + custom",
        "Full API access",
        "Onsite training",
        "Custom development"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">
          Choose the plan that's right for your business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`p-8 flex flex-col ${
              plan.popular ? 'border-2 border-primary shadow-lg relative' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <DollarSign className="h-6 w-6 text-gray-500" />
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-500">/month</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => navigate('/login')}
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;