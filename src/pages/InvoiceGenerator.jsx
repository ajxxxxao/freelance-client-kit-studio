import { Copy, Download, Printer, ReceiptText, RefreshCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Notice from "../components/common/Notice.jsx";
import SelectField from "../components/common/SelectField.jsx";
import TextArea from "../components/common/TextArea.jsx";
import TextInput from "../components/common/TextInput.jsx";
import InvoicePreview from "../components/preview/InvoicePreview.jsx";
import {
  getClients,
  getProjects,
  getSettings,
  saveGeneratedDocument,
} from "../services/storageService.js";
import { copyToClipboard, exportCSV, exportPDF } from "../services/exportService.js";
import {
  buildTemplateVariables,
  getInvoiceTemplates,
  getTemplateById,
  renderTemplate,
} from "../services/templateService.js";
import { formatCurrency, generateInvoiceNumber } from "../utils/formatters.js";
import {
  findById,
  getProjectDisplayName,
  orderProjectsByClient,
} from "../utils/generatorHelpers.js";
import PageShell from "./PageShell.jsx";

const invoiceTemplates = getInvoiceTemplates();

function InvoiceGenerator() {
  const [clients, setClients] = useState([]);
  const [content, setContent] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(invoiceTemplates[0]?.id || "");
  const [settings, setSettings] = useState({});
  const [taxAmount, setTaxAmount] = useState("0");

  useEffect(() => {
    const loadedClients = getClients();
    const loadedProjects = getProjects();

    setClients(loadedClients);
    setProjects(loadedProjects);
    setSettings(getSettings());

    if (loadedProjects[0]) {
      setSelectedProjectId(loadedProjects[0].id);
      setSelectedClientId(loadedProjects[0].clientId);
    } else if (loadedClients[0]) {
      setSelectedClientId(loadedClients[0].id);
    }
  }, []);

  const orderedProjects = useMemo(
    () => orderProjectsByClient(projects, selectedClientId),
    [projects, selectedClientId],
  );
  const selectedClient = findById(clients, selectedClientId);
  const selectedProject = findById(projects, selectedProjectId);
  const selectedTemplate =
    getTemplateById("invoice", selectedTemplateId) || invoiceTemplates[0];
  const numericTaxAmount = Number.isFinite(Number(taxAmount)) ? Number(taxAmount) : 0;
  const projectPrice = Number.isFinite(Number(selectedProject?.price))
    ? Number(selectedProject.price)
    : 0;
  const totalAmount = projectPrice + numericTaxAmount;
  const projectDisplayName = getProjectDisplayName(selectedProject);
  const canUseGenerator = clients.length > 0 && projects.length > 0;

  function handleClientChange(clientId) {
    setSelectedClientId(clientId);
    setNotice("");

    if (selectedProject && selectedProject.clientId !== clientId) {
      setSelectedProjectId("");
    }
  }

  function handleProjectChange(projectId) {
    const project = findById(projects, projectId);

    setSelectedProjectId(projectId);
    setNotice("");

    if (project?.clientId && project.clientId !== selectedClientId) {
      setSelectedClientId(project.clientId);
    }
  }

  function handleGenerate() {
    if (!selectedClient || !selectedProject || !selectedTemplate) {
      setNotice("Choose a client, project, and template before generating.");
      return;
    }

    const variables = buildTemplateVariables(selectedClient, selectedProject, settings, {
      invoiceNumber,
      taxAmount: numericTaxAmount,
      totalAmount,
    });
    const renderedTemplate = renderTemplate(selectedTemplate, variables);

    setContent(renderedTemplate.content || "");
    setNotice("Invoice generated. You can edit it before saving.");
  }

  async function handleCopy() {
    if (!content.trim()) {
      setNotice("Generate or enter invoice content before copying.");
      return;
    }

    const copied = await copyToClipboard(content);
    setNotice(copied ? "Invoice copied to clipboard." : "Copy failed.");
  }

  function getInvoiceCSVRows() {
    return [
      {
        invoiceNumber,
        clientName: selectedClient?.clientName || "",
        companyName: selectedClient?.companyName || "",
        projectName: selectedProject?.projectName || "",
        serviceType: selectedProject?.serviceType || "",
        amount: projectPrice,
        taxAmount: numericTaxAmount,
        totalAmount,
        currency: selectedProject?.currency || "USD",
        content,
      },
    ];
  }

  function handleExportCSV() {
    if (!content.trim()) {
      setNotice("Generate invoice content before exporting.");
      return;
    }

    exportCSV(`Invoice - ${projectDisplayName}`, getInvoiceCSVRows());
    setNotice("Invoice CSV export started.");
  }

  function handleExportPDF() {
    if (!content.trim()) {
      setNotice("Generate invoice content before exporting.");
      return;
    }

    const exported = exportPDF(`Invoice - ${projectDisplayName}`, content);
    setNotice(exported ? "Invoice print window opened." : "Unable to open print window.");
  }

  function handleSave() {
    if (!selectedClient || !selectedProject || !content.trim()) {
      setNotice("Generate invoice content before saving.");
      return;
    }

    saveGeneratedDocument({
      type: "invoice",
      title: `Invoice - ${projectDisplayName}`,
      clientId: selectedClient.id,
      projectId: selectedProject.id,
      content,
      metadata: {
        invoiceNumber,
        totalAmount,
        currency: selectedProject.currency,
        templateName: selectedTemplate?.name || "",
      },
    });
    setNotice("Invoice saved to Generated Documents.");
  }

  return (
    <PageShell
      description="Prepare simple client-ready invoices with project details, tax fields, totals, and payment instructions."
      eyebrow="Generator"
      title="Invoice Generator"
    >
      {!canUseGenerator ? (
        <Card>
          <EmptyState
            description="Create at least one client and one project before generating invoices."
            title="Client and project required"
          />
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/clients" variant="secondary">
              Create client
            </Button>
            <Button as={Link} to="/projects">
              Create project
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <Card>
              <h3 className="text-base font-semibold text-zinc-950">Invoice inputs</h3>
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <TextInput
                    label="Invoice number"
                    onChange={(event) => setInvoiceNumber(event.target.value)}
                    placeholder="INV-0001"
                    value={invoiceNumber}
                  />
                  <Button
                    className="self-end"
                    type="button"
                    variant="secondary"
                    onClick={() => setInvoiceNumber(generateInvoiceNumber())}
                  >
                    <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                    New
                  </Button>
                </div>
                <SelectField
                  label="Client"
                  onChange={(event) => handleClientChange(event.target.value)}
                  value={selectedClientId}
                >
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.clientName}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  label="Project"
                  onChange={(event) => handleProjectChange(event.target.value)}
                  value={selectedProjectId}
                >
                  <option value="">Select project</option>
                  {orderedProjects.map((project) => {
                    const client = findById(clients, project.clientId);

                    return (
                      <option key={project.id} value={project.id}>
                        {project.projectName} - {client?.clientName || "Unknown client"}
                      </option>
                    );
                  })}
                </SelectField>
                <SelectField
                  label="Invoice template"
                  onChange={(event) => setSelectedTemplateId(event.target.value)}
                  value={selectedTemplateId}
                >
                  {invoiceTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </SelectField>
                <TextInput
                  label="Tax amount"
                  min="0"
                  onChange={(event) => setTaxAmount(event.target.value)}
                  placeholder="0"
                  step="0.01"
                  type="number"
                  value={taxAmount}
                />
                <div className="rounded-lg bg-stone-50 p-4 text-sm text-zinc-700">
                  Total amount:{" "}
                  <span className="font-semibold text-zinc-950">
                    {formatCurrency(totalAmount, selectedProject?.currency || "USD")}
                  </span>
                </div>
                <Button className="w-full" type="button" onClick={handleGenerate}>
                  <ReceiptText className="h-4 w-4" aria-hidden="true" />
                  Generate invoice
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-zinc-950">Editable content</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Saved invoices use the edited version below.
              </p>
              <TextArea
                className="mt-4"
                onChange={(event) => setContent(event.target.value)}
                placeholder="Generate an invoice to edit the content here."
                rows={18}
                value={content}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  disabled={!content.trim()}
                  type="button"
                  variant="secondary"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copy
                </Button>
                <Button disabled={!content.trim()} type="button" onClick={handleSave}>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save document
                </Button>
                <Button
                  disabled={!content.trim()}
                  type="button"
                  variant="secondary"
                  onClick={handleExportCSV}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export CSV
                </Button>
                <Button
                  disabled={!content.trim()}
                  type="button"
                  variant="secondary"
                  onClick={handleExportPDF}
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Export PDF
                </Button>
              </div>
              <div className="mt-4">
                <Notice message={notice} />
              </div>
            </Card>
          </div>

          <InvoicePreview content={content} invoiceNumber={invoiceNumber || "Invoice"} />
        </div>
      )}
    </PageShell>
  );
}

export default InvoiceGenerator;
