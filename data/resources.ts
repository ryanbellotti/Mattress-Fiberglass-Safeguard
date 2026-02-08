export interface ResourceLink {
  label: string;
  url: string;
  sub: string;
}

export interface ResourceCategory {
  category: string;
  links: ResourceLink[];
}

export const DASHBOARD_RESOURCES: ResourceCategory[] = [
  {
    category: "Official Information",
    links: [
      { label: "Mattress Fiberglass Org", url: "https://mattressfiberglass.org", sub: "Main Website" },
      { label: "CA Dept Public Health", url: "https://cdph.ca.gov", sub: "Fact Sheet" },
      { label: "NIH Research", url: "https://nih.gov", sub: "Science" }
    ]
  },
  {
    category: "Safety & ID",
    links: [
      { label: "Fiberglass-Free Brands", url: "#", sub: "Safe List" },
      { label: "Sleep Advisor Guide", url: "https://sleepadvisor.org", sub: "Identification" },
      { label: "Poison Control", url: "https://poison.org", sub: "Expert Info" }
    ]
  },
  {
    category: "Community & Reporting",
    links: [
      { label: "Facebook Support Group", url: "#", sub: "Join Community" },
      { label: "SaferProducts.gov", url: "https://saferproducts.gov", sub: "Report Incident" }
    ]
  }
];
