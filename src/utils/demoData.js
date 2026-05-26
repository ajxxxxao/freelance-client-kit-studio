import { storageKeys } from "./constants.js";

const demoClientIds = {
  northstar: "demo_client_northstar_studio",
  clearpath: "demo_client_clearpath_consulting",
};

const demoProjectIds = {
  website: "demo_project_website_redesign",
  seo: "demo_project_seo_content_sprint",
};

const demoDocumentIds = {
  proposal: "demo_document_proposal_website_redesign",
  invoice: "demo_document_invoice_website_redesign",
  contract: "demo_document_contract_website_redesign",
  email: "demo_document_email_website_redesign",
};

function hasLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readArray(key) {
  if (!hasLocalStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeArray(key, value) {
  if (!hasLocalStorage()) {
    return value;
  }

  window.localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
  return value;
}

function removeDemoItems(items) {
  return items.filter((item) => item?.isDemo !== true);
}

function dateInputFromNow(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);

  return date.toISOString().slice(0, 10);
}

function timestampFromNow(daysFromNow, hoursOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(date.getHours() + hoursOffset);

  return date.toISOString();
}

function buildDemoData() {
  const northstarClient = {
    id: demoClientIds.northstar,
    clientName: "Mia Carter",
    companyName: "Northstar Studio",
    email: "mia@northstarstudio.co",
    phone: "+1 415 555 0198",
    address: "San Francisco, CA",
    notes: "Brand and web design client.",
    isDemo: true,
    createdAt: timestampFromNow(-12),
    updatedAt: timestampFromNow(-1, -2),
  };

  const clearpathClient = {
    id: demoClientIds.clearpath,
    clientName: "Daniel Brooks",
    companyName: "ClearPath Consulting",
    email: "daniel@clearpath.co",
    phone: "+1 212 555 0142",
    address: "New York, NY",
    notes: "Marketing strategy client.",
    isDemo: true,
    createdAt: timestampFromNow(-18),
    updatedAt: timestampFromNow(-2, -4),
  };

  const websiteProject = {
    id: demoProjectIds.website,
    projectName: "Website Redesign",
    clientId: demoClientIds.northstar,
    serviceType: "Web Design",
    scope:
      "Homepage redesign, service page updates, responsive layout improvements, and client-ready handoff notes.",
    price: 2400,
    currency: "USD",
    startDate: dateInputFromNow(3),
    dueDate: dateInputFromNow(28),
    status: "active",
    isDemo: true,
    createdAt: timestampFromNow(-10),
    updatedAt: timestampFromNow(-1, -1),
  };

  const seoProject = {
    id: demoProjectIds.seo,
    projectName: "SEO Content Sprint",
    clientId: demoClientIds.clearpath,
    serviceType: "SEO Consulting",
    scope:
      "Keyword mapping, content briefs, on-page recommendations, and a 30-day content plan.",
    price: 1800,
    currency: "USD",
    startDate: dateInputFromNow(-14),
    dueDate: dateInputFromNow(7),
    status: "delivered",
    isDemo: true,
    createdAt: timestampFromNow(-20),
    updatedAt: timestampFromNow(-3),
  };

  const proposalContent = `# Proposal - Website Redesign

Prepared for Mia Carter at Northstar Studio.

## Project Background
Northstar Studio needs a focused website refresh that presents its services clearly, improves mobile readability, and creates a stronger path from inquiry to booked consultation.

## Scope of Services
- Homepage redesign
- Service page updates
- Responsive layout improvements
- Client-ready handoff notes

## Timeline
The estimated project window is 4 weeks from kickoff.

## Investment
The proposed project fee is USD 2,400.

## Next Step
Approve the proposal and confirm the kickoff date to begin scheduling design work.`;

  const invoiceContent = `# Invoice - Website Redesign

Invoice Number: INV-DEMO-1001

Client: Mia Carter, Northstar Studio
Project: Website Redesign
Service: Web Design

Subtotal: USD 2,400
Tax: USD 0
Total: USD 2,400

Payment can be made using the payment details provided by the service provider.`;

  const contractContent = `# Contract Terms - Website Redesign

This template is for general business use only and does not constitute legal advice.

## Scope of Services
The service provider will complete homepage redesign, service page updates, responsive layout improvements, and client-ready handoff notes.

## Payment Terms
The project fee is USD 2,400. Payment terms should be confirmed before work begins.

## Revisions
The project includes up to two rounds of reasonable revisions within the agreed scope.

## Delivery Timeline
The estimated delivery window is 4 weeks from kickoff, subject to timely feedback and asset delivery.

## Confidentiality
Both parties agree to protect private business information shared during the project.`;

  const emailContent = `Subject: Proposal for Website Redesign

Hi Mia,

Thank you for the opportunity to support Northstar Studio with the Website Redesign project.

I have prepared a proposal covering the homepage redesign, service page updates, responsive layout improvements, and client-ready handoff notes. The proposed investment is USD 2,400.

Please review the details and let me know if you would like to move forward.

Best,
Your Name`;

  const documents = [
    {
      id: demoDocumentIds.proposal,
      type: "proposal",
      title: "Proposal - Website Redesign",
      clientId: demoClientIds.northstar,
      projectId: demoProjectIds.website,
      content: proposalContent,
      metadata: {
        templateName: "Professional Proposal",
      },
      isDemo: true,
      createdAt: timestampFromNow(-1, -2),
      updatedAt: timestampFromNow(-1, -2),
    },
    {
      id: demoDocumentIds.invoice,
      type: "invoice",
      title: "Invoice - Website Redesign",
      clientId: demoClientIds.northstar,
      projectId: demoProjectIds.website,
      content: invoiceContent,
      metadata: {
        invoiceNumber: "INV-DEMO-1001",
        totalAmount: 2400,
        currency: "USD",
        templateName: "Standard Invoice",
      },
      isDemo: true,
      createdAt: timestampFromNow(-1, -1),
      updatedAt: timestampFromNow(-1, -1),
    },
    {
      id: demoDocumentIds.contract,
      type: "contract",
      title: "Contract Terms - Website Redesign",
      clientId: demoClientIds.northstar,
      projectId: demoProjectIds.website,
      content: contractContent,
      metadata: {
        templateName: "Standard Service Terms",
      },
      isDemo: true,
      createdAt: timestampFromNow(-1),
      updatedAt: timestampFromNow(-1),
    },
    {
      id: demoDocumentIds.email,
      type: "email",
      title: "Proposal Sending Email - Website Redesign",
      clientId: demoClientIds.northstar,
      projectId: demoProjectIds.website,
      content: emailContent,
      metadata: {
        templateName: "Proposal Sending Email",
      },
      isDemo: true,
      createdAt: timestampFromNow(0, -3),
      updatedAt: timestampFromNow(0, -3),
    },
  ];

  return {
    clients: [northstarClient, clearpathClient],
    projects: [websiteProject, seoProject],
    documents,
  };
}

export function seedDemoData() {
  const demoData = buildDemoData();

  writeArray(storageKeys.clients, [
    ...demoData.clients,
    ...removeDemoItems(readArray(storageKeys.clients)),
  ]);
  writeArray(storageKeys.projects, [
    ...demoData.projects,
    ...removeDemoItems(readArray(storageKeys.projects)),
  ]);
  writeArray(storageKeys.documents, [
    ...demoData.documents,
    ...removeDemoItems(readArray(storageKeys.documents)),
  ]);

  return demoData;
}

export function clearDemoData() {
  const clients = writeArray(storageKeys.clients, removeDemoItems(readArray(storageKeys.clients)));
  const projects = writeArray(storageKeys.projects, removeDemoItems(readArray(storageKeys.projects)));
  const documents = writeArray(
    storageKeys.documents,
    removeDemoItems(readArray(storageKeys.documents)),
  );

  return {
    clients,
    projects,
    documents,
  };
}
