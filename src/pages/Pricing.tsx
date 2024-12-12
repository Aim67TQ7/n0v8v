import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, Star, Users, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect authenticated users away from pricing
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handlePlanSelect = () => {
    navigate('/login');
    toast({
      title: "Start your free trial",
      description: "Sign up to begin your 7-day free trial.",
    });
  };

  const plans = [
    {
      name: "Basic",
      setupPrice: "99",
      monthlyPrice: "14.95",
      features: [
        "7-day free trial",
        "Access to 3 modules of your choice",
        "GPT branding features",
        "Customizable assistants",
        "SOC II compliant data storage",
        "Per user pricing",
        "One-time setup fee per user"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      setupPrice: "99",
      monthlyPrice: "39.95",
      features: [
        "Access to 10 modules",
        "New modules included",
        "Advanced branding features",
        "Vertical agents (coming soon)",
        "Price locked for 1 year",
        "GPT branding features",
        "Customizable assistants",
        "SOC II compliant data storage",
        "Per user pricing",
        "One-time setup fee per user"
      ],
      popular: true,
      promotion: "Lock in $39.95/mo until Dec 31, 2024 (increases to $79.95/mo in 2025)",
      cta: "Get Started"
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited users",
        "Unlimited module access",
        "All current and future features",
        "Advanced branding features",
        "Vertical agents",
        "GPT branding features",
        "Customizable assistants",
        "SOC II compliant data storage",
        "Priority support"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that's right for your business. All plans include GPT branding, 
          customizable assistants, and SOC II compliant data storage.
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
              {plan.price ? (
                <div className="flex items-baseline gap-1">
                  <DollarSign className="h-6 w-6 text-gray-500" />
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-600">Setup fee:</span>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-xl font-bold">{plan.setupPrice}</span>
                    <span className="text-sm text-gray-600">/user</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-600">Monthly:</span>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-xl font-bold">{plan.monthlyPrice}</span>
                    <span className="text-sm text-gray-600">/user/mo</span>
                  </div>
                </div>
              )}
            </div>

            {plan.promotion && (
              <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                <Calendar className="inline-block h-4 w-4 mr-2" />
                {plan.promotion}
              </div>
            )}

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
              onClick={handlePlanSelect}
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-gray-500">
        <p>All prices in USD. Prices subject to change with notice.</p>
      </div>
    </div>
  );
};

export default PricingPage;