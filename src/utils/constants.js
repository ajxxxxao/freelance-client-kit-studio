import {
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  Gauge,
  Gem,
  Inbox,
  Mail,
  ReceiptText,
  UsersRound,
} from "lucide-react";

export const appName = "Freelance Client Kit Studio";

export const storageKeys = {
  clients: "fck_clients",
  projects: "fck_projects",
  documents: "fck_documents",
  settings: "fck_settings",
};

export const defaultSettings = {
  defaultCurrency: "USD",
  businessName: "",
  businessEmail: "",
  paymentInfo: "",
  watermarkEnabled: true,
};

export const currencies = ["USD", "EUR", "GBP", "CNY"];

export const projectStatuses = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Gauge,
    description: "Workspace overview",
  },
  {
    label: "Clients",
    path: "/clients",
    icon: UsersRound,
    description: "Manage client records",
  },
  {
    label: "Projects",
    path: "/projects",
    icon: BriefcaseBusiness,
    description: "Track service work",
  },
  {
    label: "Proposal Generator",
    path: "/proposal",
    icon: FileText,
    description: "Create client proposals",
  },
  {
    label: "Invoice Generator",
    path: "/invoice",
    icon: ReceiptText,
    description: "Prepare invoices",
  },
  {
    label: "Contract Terms",
    path: "/contract",
    icon: FileCheck2,
    description: "Draft basic terms",
  },
  {
    label: "Email Templates",
    path: "/email-templates",
    icon: Mail,
    description: "Reusable client emails",
  },
  {
    label: "Export Center",
    path: "/export-center",
    icon: Inbox,
    description: "Review saved outputs",
  },
  {
    label: "Upgrade",
    path: "/upgrade",
    icon: Gem,
    description: "Plans and limits",
  },
];
