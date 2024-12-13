import { Card } from "@/components/ui/card";
import { Search, Globe, Database } from "lucide-react";
import { Link } from "react-router-dom";

const scrapingMethods = [
  {
    title: "Google Maps Scraper",
    description: "Scrape business information from Google Maps including contact details and ratings",
    icon: Search,
    href: "/leads/scraping/google-maps",
    status: "ready"
  },
  {
    title: "Website Scraper",
    description: "Extract data from websites using custom selectors and patterns",
    icon: Globe,
    href: "/leads/scraping/website",
    status: "coming-soon"
  },
  {
    title: "Database Import",
    description: "Import leads from existing databases or spreadsheets",
    icon: Database,
    href: "/leads/scraping/import",
    status: "coming-soon"
  }
];

const WebScraping = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lead Generation Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scrapingMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Link
              key={method.title}
              to={method.href}
              className={`block transition-transform duration-200 hover:scale-105 ${
                method.status === "coming-soon" ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start gap-4">
                  <Icon className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{method.title}</h3>
                    <p className="text-muted-foreground mt-1">{method.description}</p>
                    {method.status === "coming-soon" && (
                      <span className="inline-block mt-2 text-xs bg-accent px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WebScraping;