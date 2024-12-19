import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is AI Ops Master?",
      answer: "AI Ops Master is a comprehensive platform that combines artificial intelligence with operational excellence. It provides tools for process analysis, data management, and automated assistance through specialized AI agents."
    },
    {
      question: "How do the AI agents work?",
      answer: "Our AI agents are specialized assistants designed for specific tasks. Each agent has unique capabilities: Riley handles conversations, Morgan analyzes tone and sentiment, Quincy helps with data scraping, Chip conducts research, and Dexter specializes in data analysis."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All data is encrypted, and we follow industry best practices for data protection. Access is strictly controlled through user authentication and authorization."
    },
    {
      question: "How can I get started?",
      answer: "Begin by exploring our available tools and agents. Each tool has specific documentation and guides. For personalized assistance, interact with Riley, our conversation bot."
    },
    {
      question: "What kind of analysis can Dexter perform?",
      answer: "Dexter can perform various types of data analysis including statistical analysis, trend identification, pattern recognition, and data visualization. Upload your data and specify your analysis needs."
    },
    {
      question: "How accurate is Morgan's sentiment analysis?",
      answer: "Morgan uses advanced NLP models for high-accuracy sentiment and tone analysis. The system continuously learns and improves through user feedback and validation."
    },
    {
      question: "What can Chip research?",
      answer: "Chip can research various topics including market trends, competitor analysis, industry reports, and technical documentation. Simply provide your research query and relevant parameters."
    },
    {
      question: "How do I use Quincy for scraping?",
      answer: "Quincy helps with ethical data collection from permitted sources. Specify your target data requirements, and Quincy will help gather and structure the information while respecting source websites' terms of service."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
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