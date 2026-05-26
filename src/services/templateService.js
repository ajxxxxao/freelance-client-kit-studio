import { defaultSettings } from "../utils/constants.js";
import { formatDate, generateInvoiceNumber } from "../utils/formatters.js";
import contractTemplates from "../templates/contractTemplates.json";
import emailTemplates from "../templates/emailTemplates.json";
import invoiceTemplates from "../templates/invoiceTemplates.json";
import proposalTemplates from "../templates/proposalTemplates.json";

const templateCollections = {
  proposal: proposalTemplates,
  proposals: proposalTemplates,
  invoice: invoiceTemplates,
  invoices: invoiceTemplates,
  contract: contractTemplates,
  contracts: contractTemplates,
  email: emailTemplates,
  emails: emailTemplates,
};

function asTemplateList(value) {
  return Array.isArray(value) ? value : [];
}

function safeString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function formatAmount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: number % 1 === 0 ? 0 : 2,
  }).format(number);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function formatTemplateDate(value) {
  return value ? formatDate(value) : "";
}

function renderValue(value, variables) {
  if (typeof value === "string") {
    return renderTemplateByString(value, variables);
  }

  if (Array.isArray(value)) {
    return value.map((item) => renderValue(item, variables));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [
        key,
        renderValue(entryValue, variables),
      ]),
    );
  }

  return value;
}

export function renderTemplate(template, variables = {}) {
  return renderValue(template, variables);
}

export function renderTemplateByString(templateString, variables = {}) {
  const resolvedVariables = variables && typeof variables === "object" ? variables : {};

  return safeString(templateString).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) =>
    safeString(resolvedVariables[key]),
  );
}

export function getProposalTemplates() {
  return asTemplateList(proposalTemplates);
}

export function getInvoiceTemplates() {
  return asTemplateList(invoiceTemplates);
}

export function getContractTemplates() {
  return asTemplateList(contractTemplates);
}

export function getEmailTemplates() {
  return asTemplateList(emailTemplates);
}

export function getTemplateById(type, templateId) {
  const collection = asTemplateList(templateCollections[safeString(type).toLowerCase()]);

  return collection.find((template) => template.id === templateId) || null;
}

export function buildTemplateVariables(client = {}, project = {}, settings = {}, extraData = {}) {
  const resolvedClient = client && typeof client === "object" ? client : {};
  const resolvedProject = project && typeof project === "object" ? project : {};
  const resolvedExtraData = extraData && typeof extraData === "object" ? extraData : {};
  const resolvedSettings = {
    ...defaultSettings,
    ...(settings && typeof settings === "object" ? settings : {}),
  };
  const currency =
    resolvedExtraData.currency ||
    resolvedProject.currency ||
    resolvedSettings.defaultCurrency ||
    "USD";
  const price = toNumber(resolvedExtraData.price ?? resolvedProject.price ?? 0);
  const taxAmount = toNumber(resolvedExtraData.taxAmount ?? 0);
  const totalAmount = toNumber(resolvedExtraData.totalAmount, price + taxAmount);

  return {
    clientName: safeString(resolvedClient.clientName),
    companyName: safeString(resolvedClient.companyName),
    projectName: safeString(resolvedProject.projectName),
    price: formatAmount(price),
    currency: safeString(currency),
    dueDate: formatTemplateDate(resolvedExtraData.dueDate || resolvedProject.dueDate),
    serviceType: safeString(resolvedProject.serviceType),
    scope: safeString(resolvedProject.scope),
    startDate: formatTemplateDate(resolvedExtraData.startDate || resolvedProject.startDate),
    businessName: safeString(resolvedSettings.businessName),
    businessEmail: safeString(resolvedSettings.businessEmail),
    paymentInfo: safeString(resolvedExtraData.paymentInfo ?? resolvedSettings.paymentInfo),
    invoiceNumber: safeString(resolvedExtraData.invoiceNumber || generateInvoiceNumber()),
    taxAmount: formatAmount(taxAmount),
    totalAmount: formatAmount(totalAmount),
  };
}
