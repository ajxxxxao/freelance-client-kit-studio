import { BriefcaseBusiness, Download, FileText, Printer, Trash2, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Notice from "../components/common/Notice.jsx";
import SelectField from "../components/common/SelectField.jsx";
import {
  deleteGeneratedDocument,
  getClients,
  getGeneratedDocuments,
  getProjects,
} from "../services/storageService.js";
import { exportCSV, exportMarkdown, exportPDF } from "../services/exportService.js";
import { documentTypeLabel, formatShortDateTime } from "../utils/formatters.js";
import PageShell from "./PageShell.jsx";

const documentTypes = [
  { label: "All documents", value: "all" },
  { label: "Proposal", value: "proposal" },
  { label: "Invoice", value: "invoice" },
  { label: "Contract terms", value: "contract" },
  { label: "Email", value: "email" },
];

const typeTone = {
  proposal: "sky",
  invoice: "teal",
  contract: "amber",
  email: "emerald",
};

function makeMapById(items) {
  return new Map(items.map((item) => [item.id, item]));
}

function ExportCenter() {
  const [clients, setClients] = useState([]);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setClients(getClients());
    setProjects(getProjects());
    setDocuments(getGeneratedDocuments());
  }, []);

  const clientById = useMemo(() => makeMapById(clients), [clients]);
  const projectById = useMemo(() => makeMapById(projects), [projects]);
  const filteredDocuments = useMemo(
    () =>
      filter === "all"
        ? documents
        : documents.filter((document) => document.type === filter),
    [documents, filter],
  );
  const documentStats = useMemo(
    () => [
      { label: "Saved Documents", value: documents.length },
      {
        label: "Proposals",
        value: documents.filter((document) => document.type === "proposal").length,
      },
      {
        label: "Invoices",
        value: documents.filter((document) => document.type === "invoice").length,
      },
      {
        label: "Contracts",
        value: documents.filter((document) => document.type === "contract").length,
      },
      {
        label: "Emails",
        value: documents.filter((document) => document.type === "email").length,
      },
    ],
    [documents],
  );

  function getClient(document) {
    return clientById.get(document.clientId);
  }

  function getProject(document) {
    return projectById.get(document.projectId);
  }

  function getInvoiceRows(document) {
    const client = getClient(document);
    const project = getProject(document);

    return [
      {
        title: document.title,
        invoiceNumber: document.metadata?.invoiceNumber || "",
        clientName: client?.clientName || "",
        companyName: client?.companyName || "",
        projectName: project?.projectName || "",
        currency: document.metadata?.currency || project?.currency || "",
        totalAmount: document.metadata?.totalAmount ?? "",
        templateName: document.metadata?.templateName || "",
        createdAt: document.createdAt,
        content: document.content,
      },
    ];
  }

  function handleDeleteDocument() {
    if (!documentToDelete) {
      return;
    }

    setDocuments(deleteGeneratedDocument(documentToDelete.id));
    setDocumentToDelete(null);
    setNotice("Generated document deleted.");
  }

  function handleExportClientsCSV() {
    exportCSV(
      "Clients",
      clients.map((client) => ({
        id: client.id,
        clientName: client.clientName,
        companyName: client.companyName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        notes: client.notes,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      })),
    );
    setNotice("Clients CSV export started.");
  }

  function handleExportProjectsCSV() {
    exportCSV(
      "Projects",
      projects.map((project) => {
        const client = clientById.get(project.clientId);

        return {
          id: project.id,
          projectName: project.projectName,
          clientName: client?.clientName || "",
          clientId: project.clientId,
          serviceType: project.serviceType,
          scope: project.scope,
          price: project.price,
          currency: project.currency,
          startDate: project.startDate,
          dueDate: project.dueDate,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      }),
    );
    setNotice("Projects CSV export started.");
  }

  function handleExportMarkdown(document) {
    exportMarkdown(document.title, document.content);
    setNotice(`${documentTypeLabel(document.type)} Markdown export started.`);
  }

  function handleExportInvoiceCSV(document) {
    exportCSV(document.title, getInvoiceRows(document));
    setNotice("Invoice CSV export started.");
  }

  function handleExportPDF(document) {
    const exported = exportPDF(document.title, document.content);
    setNotice(exported ? "Print window opened." : "Unable to open print window.");
  }

  function renderDocumentActions(document) {
    if (document.type === "invoice") {
      return (
        <>
          <Button type="button" variant="secondary" onClick={() => handleExportInvoiceCSV(document)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleExportPDF(document)}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Export PDF
          </Button>
        </>
      );
    }

    if (document.type === "email") {
      return (
        <Button type="button" variant="secondary" onClick={() => handleExportMarkdown(document)}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export Markdown
        </Button>
      );
    }

    return (
      <>
        <Button type="button" variant="secondary" onClick={() => handleExportMarkdown(document)}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export Markdown
        </Button>
        <Button type="button" variant="secondary" onClick={() => handleExportPDF(document)}>
          <Printer className="h-4 w-4" aria-hidden="true" />
          Export PDF
        </Button>
      </>
    );
  }

  return (
    <>
      <PageShell
        description="Review generated documents and prepare local exports from one place."
        eyebrow="Exports"
        title="Export Center"
        actions={
          <>
            <Button type="button" variant="secondary" onClick={handleExportClientsCSV}>
              <UsersRound className="h-4 w-4" aria-hidden="true" />
              Export Clients CSV
            </Button>
            <Button type="button" variant="secondary" onClick={handleExportProjectsCSV}>
              <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
              Export Projects CSV
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {documentStats.map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-zinc-950">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card>
            <h3 className="text-base font-semibold text-zinc-950">Filters</h3>
            <div className="mt-5 space-y-4">
              <SelectField
                label="Document type"
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </SelectField>
              <div className="rounded-lg bg-stone-50 p-4 text-sm text-zinc-600">
                <p>
                  {filteredDocuments.length} of {documents.length} saved documents shown.
                </p>
              </div>
              <Notice message={notice} />
            </div>
          </Card>

          <Card>
            <div className="mb-5">
              <h3 className="text-base font-semibold text-zinc-950">Generated documents</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Saved proposals, invoices, contracts, and emails are stored in this browser.
              </p>
            </div>

            {filteredDocuments.length === 0 ? (
              <EmptyState
                title="No generated documents"
                description="Generate and save a document first, then export it from this center."
              />
            ) : (
              <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
                {filteredDocuments.map((document) => {
                  const client = getClient(document);
                  const project = getProject(document);

                  return (
                    <article
                      className="grid gap-4 bg-white p-4 transition hover:bg-stone-50 xl:grid-cols-[1fr_auto]"
                      key={document.id}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <FileText className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                          <h4 className="truncate text-base font-semibold text-zinc-950">
                            {document.title}
                          </h4>
                          <Badge tone={typeTone[document.type] || "neutral"}>
                            {documentTypeLabel(document.type)}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm text-zinc-600">
                          <span>
                            <span className="font-medium text-zinc-800">Client:</span>{" "}
                            {client?.clientName || "Unknown client"}
                          </span>
                          <span className="hidden text-zinc-300 sm:inline">·</span>
                          <span>
                            <span className="font-medium text-zinc-800">Project:</span>{" "}
                            {project?.projectName || "Unknown project"}
                          </span>
                          <span className="hidden text-zinc-300 sm:inline">·</span>
                          <span>{formatShortDateTime(document.createdAt)}</span>
                        </div>
                        {document.metadata?.templateName ? (
                          <p className="mt-3 text-xs text-zinc-500">
                            Template: {document.metadata.templateName}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-start gap-2 xl:justify-end">
                        {renderDocumentActions(document)}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setDocumentToDelete(document)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </PageShell>

      <ConfirmDialog
        description={
          documentToDelete
            ? `Delete ${documentToDelete.title}? This removes the generated document from local storage.`
            : "Delete this generated document?"
        }
        isOpen={Boolean(documentToDelete)}
        onCancel={() => setDocumentToDelete(null)}
        onConfirm={handleDeleteDocument}
        title="Delete generated document"
      />
    </>
  );
}

export default ExportCenter;
