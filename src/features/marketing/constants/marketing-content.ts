export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#features" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
] as const;

export const FEATURES = [
  {
    title: "Data Input Integration",
    description:
      "Seamlessly connect ERP systems, utility APIs, and spreadsheets to ingest activity data automatically with 99.9% accuracy.",
    icon: "database" as const,
  },
  {
    title: "Automated Scope 1-2-3",
    description:
      "Apply verified global emission factors to calculate your total footprint with audit-ready transparency and GHG Protocol alignment.",
    icon: "layers" as const,
  },
  {
    title: "Interactive Dashboards",
    description:
      "Visualize hotspots, track reduction targets, and generate stakeholder-ready reports instantly for TCFD, CSRD, and more.",
    icon: "bar-chart" as const,
  },
] as const;

export type PricingInterval = "monthly" | "annually";

export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    description: "For emerging teams starting their ESG journey.",
    monthlyPrice: 49,
    features: ["Scope 1 & 2 Tracking", "Basic ESG Reporting", "3 User Seats"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Comprehensive tools for growing sustainability teams.",
    monthlyPrice: 199,
    features: [
      "Full Scope 1, 2, & Core 3",
      "API & ERP Integrations",
      "Audit-Ready Exports",
      "10 User Seats",
    ],
    cta: "Get Started",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for complex global operations.",
    priceLabel: "Custom",
    features: [
      "Full Value Chain (Scope 3)",
      "Custom Emission Factors",
      "Dedicated Success Manager",
      "Unlimited Seats",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: ["Features", "Integrations", "Pricing", "Enterprise"],
  },
  {
    title: "Resources",
    links: ["GHG Methodology", "ESG Blog", "Help Center", "API Docs"],
  },
  {
    title: "Legal & Security",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "Security Certs",
      "Sustainability Report",
    ],
  },
] as const;
