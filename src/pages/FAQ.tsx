import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is AI Ops Master?",
      answer: "AI Ops Master is a comprehensive platform designed to enhance operational efficiency through AI-powered tools and analytics. It provides solutions for process improvement, data management, quality control, and operational excellence."
    },
    {
      question: "How do I get started?",
      answer: "Begin by exploring our available tools and modules in the dashboard. Each section has specific documentation and guides. For personalized assistance, use our chat feature or contact support."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All data is encrypted, and we follow industry best practices for data protection. Access is strictly controlled through user authentication and authorization."
    },
    {
      question: "What tools are available?",
      answer: "Our platform offers various tools including process analysis, quality control, lean manufacturing tools (5S, Five Whys), maintenance tracking, and operational analytics. Each tool is designed to address specific operational needs."
    },
    {
      question: "How can I customize the platform?",
      answer: "You can customize your experience through the settings panel, where you can adjust preferences, configure notifications, and set up integrations with your existing systems."
    },
    {
      question: "What kind of support is available?",
      answer: "We offer multiple support channels including in-app chat, email support, and documentation. Enterprise users also have access to dedicated support representatives."
    },
    {
      question: "Can I integrate with other systems?",
      answer: "Yes, our platform supports integration with common enterprise systems and can be customized to work with your existing infrastructure. Contact support for specific integration requirements."
    },
    {
      question: "How often is the platform updated?",
      answer: "We regularly update our platform with new features, security patches, and performance improvements. All updates are automatically deployed and documented in our changelog."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>
        <Accordion type="single" collapsible className="w-full text-lg">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default FAQ;