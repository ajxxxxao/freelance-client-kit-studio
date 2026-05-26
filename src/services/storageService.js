import { defaultSettings, storageKeys } from "../utils/constants.js";

const emptyArray = [];

function hasLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJSON(key, fallback) {
  if (!hasLocalStorage()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (!hasLocalStorage()) {
    return value;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return value;
  }

  return value;
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getTimestamp() {
  return new Date().toISOString();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : emptyArray;
}

function upsertById(items, item) {
  const existingIndex = items.findIndex((currentItem) => currentItem.id === item.id);

  if (existingIndex === -1) {
    return [item, ...items];
  }

  return items.map((currentItem, index) => (index === existingIndex ? item : currentItem));
}

function normalizeClient(client = {}, options = {}) {
  const now = getTimestamp();
  const id = client.id || createId("client");
  const createdAt = client.createdAt || now;

  return {
    id,
    clientName: client.clientName || "",
    companyName: client.companyName || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    notes: client.notes || "",
    ...(client.isDemo === true ? { isDemo: true } : {}),
    createdAt,
    updatedAt: options.touchUpdatedAt ? now : client.updatedAt || createdAt,
  };
}

function normalizeProject(project = {}, options = {}) {
  const now = getTimestamp();
  const id = project.id || createId("project");
  const createdAt = project.createdAt || now;

  return {
    id,
    projectName: project.projectName || "",
    clientId: project.clientId || "",
    serviceType: project.serviceType || "",
    scope: project.scope || "",
    price: Number.isFinite(Number(project.price)) ? Number(project.price) : 0,
    currency: project.currency || defaultSettings.defaultCurrency,
    startDate: project.startDate || "",
    dueDate: project.dueDate || "",
    status: project.status || "draft",
    ...(project.isDemo === true ? { isDemo: true } : {}),
    createdAt,
    updatedAt: options.touchUpdatedAt ? now : project.updatedAt || createdAt,
  };
}

function normalizeGeneratedDocument(document = {}, options = {}) {
  const now = getTimestamp();
  const id = document.id || createId("document");
  const createdAt = document.createdAt || now;

  return {
    id,
    type: document.type || "proposal",
    title: document.title || "Untitled document",
    clientId: document.clientId || "",
    projectId: document.projectId || "",
    content: document.content || "",
    metadata:
      document.metadata && typeof document.metadata === "object" && !Array.isArray(document.metadata)
        ? document.metadata
        : {},
    ...(document.isDemo === true ? { isDemo: true } : {}),
    createdAt,
    updatedAt: options.touchUpdatedAt ? now : document.updatedAt || createdAt,
  };
}

function normalizeSettings(settings = {}) {
  return {
    ...defaultSettings,
    ...settings,
    watermarkEnabled:
      typeof settings.watermarkEnabled === "boolean"
        ? settings.watermarkEnabled
        : defaultSettings.watermarkEnabled,
  };
}

export function getClients() {
  return ensureArray(readJSON(storageKeys.clients, emptyArray)).map(normalizeClient);
}

export function saveClient(client) {
  const clients = getClients();
  const existingClient = clients.find((currentClient) => currentClient.id === client?.id);
  const savedClient = normalizeClient(
    {
      ...existingClient,
      ...client,
    },
    { touchUpdatedAt: true },
  );

  writeJSON(storageKeys.clients, upsertById(clients, savedClient));
  return savedClient;
}

export function deleteClient(clientId) {
  const clients = getClients().filter((client) => client.id !== clientId);

  writeJSON(storageKeys.clients, clients);
  return clients;
}

export function getProjects() {
  return ensureArray(readJSON(storageKeys.projects, emptyArray)).map(normalizeProject);
}

export function saveProject(project) {
  const projects = getProjects();
  const existingProject = projects.find((currentProject) => currentProject.id === project?.id);
  const savedProject = normalizeProject(
    {
      ...existingProject,
      ...project,
    },
    { touchUpdatedAt: true },
  );

  writeJSON(storageKeys.projects, upsertById(projects, savedProject));
  return savedProject;
}

export function deleteProject(projectId) {
  const projects = getProjects().filter((project) => project.id !== projectId);

  writeJSON(storageKeys.projects, projects);
  return projects;
}

export function getGeneratedDocuments() {
  return ensureArray(readJSON(storageKeys.documents, emptyArray)).map(normalizeGeneratedDocument);
}

export function saveGeneratedDocument(document) {
  const documents = getGeneratedDocuments();
  const existingDocument = documents.find((currentDocument) => currentDocument.id === document?.id);
  const savedDocument = normalizeGeneratedDocument(
    {
      ...existingDocument,
      ...document,
    },
    { touchUpdatedAt: true },
  );

  writeJSON(storageKeys.documents, upsertById(documents, savedDocument));
  return savedDocument;
}

export function deleteGeneratedDocument(documentId) {
  const documents = getGeneratedDocuments().filter((document) => document.id !== documentId);

  writeJSON(storageKeys.documents, documents);
  return documents;
}

export function getSettings() {
  const settings = readJSON(storageKeys.settings, defaultSettings);

  return normalizeSettings(
    settings && typeof settings === "object" && !Array.isArray(settings) ? settings : defaultSettings,
  );
}

export function saveSettings(settings) {
  const savedSettings = normalizeSettings({
    ...getSettings(),
    ...(settings && typeof settings === "object" && !Array.isArray(settings) ? settings : {}),
  });

  writeJSON(storageKeys.settings, savedSettings);
  return savedSettings;
}
