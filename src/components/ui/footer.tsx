import { Link } from "react-router-dom";

export const Footer = () => {
  const siteMap = [
    {
      title: "Company",
      links: [
        { name: "Hub", href: "/hub" },
        { name: "Modules", href: "/modules" },
        { name: "Tools", href: "/tools" },
      ],
    },
    {
      title: "Operations",
      links: [
        { name: "Sales", href: "/modules/sales" },
        { name: "Engineering", href: "/modules/engineering" },
        { name: "Quality", href: "/modules/quality" },
        { name: "Production", href: "/modules/production" },
      ],
    },
    {
      title: "Tools",
      links: [
        { name: "5S Scoring", href: "/operations/lean/5s-vision" },
        { name: "Five Whys", href: "/operations/quality/five-whys" },
        { name: "PM Assist", href: "/operations/maintenance" },
        { name: "Fishbone Analysis", href: "/operations/quality/fishbone" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {siteMap.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-600 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[11px] text-gray-500 hover:text-primary hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center border-t pt-4">
          <p className="text-[10px] text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.n0v8v.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              n0v8v.com
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};