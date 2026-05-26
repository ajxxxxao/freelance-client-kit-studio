import {
  ArrowRight,
  BriefcaseBusiness,
  FilePlus2,
  FileText,
  Plus,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import {
  getClients,
  getGeneratedDocuments,
  getProjects,
} from "../services/storageService.js";
import { documentTypeLabel, formatCurrency, formatDateTime } from "../utils/formatters.js";
import PageShell from "./PageShell.jsx";

function sortByRecent(items, field = "updatedAt") {
  return [...items].sort((firstItem, secondItem) => {
    const firstTime = new Date(firstItem[field] || firstItem.createdAt || 0).getTime();
    const secondTime = new Date(secondItem[field] || secondItem.createdAt || 0).getTime();

    return secondTime - firstTime;
  });
}

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setClients(getClients());
    setProjects(getProjects());
    setDocuments(getGeneratedDocuments());
  }, []);

  const activeProjects = useMemo(
    () => projects.filter((project) => project.status === "active"),
    [projects],
  );
  const recentClients = useMemo(() => sortByRecent(clients).slice(0, 3), [clients]);
  const recentProjects = useMemo(() => sortByRecent(projects).slice(0, 3), [projects]);
  const recentDocuments = useMemo(
    () => sortByRecent(documents, "createdAt").slice(0, 3),
    [documents],
  );
  const clientById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  );

  const metrics = [
    {
      label: "Clients",
      value: clients.length,
      caption: "Stored in this browser",
      icon: UsersRound,
    },
    {
      label: "Projects",
      value: projects.length,
      caption: "Available for documents",
      icon: BriefcaseBusiness,
    },
    {
      label: "Generated documents",
      value: documents.length,
      caption: "Ready for export",
      icon: FileText,
    },
    {
      label: "Active projects",
      value: activeProjects.length,
      caption: "Currently in progress",
      icon: FilePlus2,
    },
  ];

  return (
    <PageShell
      badge="Local-first"
      description="A focused workspace for managing client context and preparing client-ready business documents."
      eyebrow="Workspace"
      title="Client document studio"
      actions={
        <>
          <Button as={Link} to="/clients">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Client
          </Button>
          <Button as={Link} to="/projects" variant="secondary">
            <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
            New Project
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-zinc-950">{metric.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{metric.caption}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">Recent clients</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Recently updated client records.
                </p>
              </div>
              <Badge tone="teal">{clients.length}</Badge>
            </div>
            {recentClients.length === 0 ? (
              <EmptyState
                title="No clients yet"
                description="Add a client to start building proposals, invoices, contracts, and emails."
              />
            ) : (
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <div
                    className="rounded-lg border border-zinc-200 bg-stone-50 p-4"
                    key={client.id}
                  >
                    <p className="font-semibold text-zinc-950">{client.clientName}</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {client.companyName || client.email || "Independent client"}
                    </p>
                    <p className="mt-3 text-xs text-zinc-500">
                      Updated {formatDateTime(client.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">Recent projects</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Project work available for document generation.
                </p>
              </div>
              <Badge tone="sky">{projects.length}</Badge>
            </div>
            {recentProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create a project and connect it to a client before generating documents."
              />
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => {
                  const client = clientById.get(project.clientId);

                  return (
                    <div
                      className="rounded-lg border border-zinc-200 bg-stone-50 p-4"
                      key={project.id}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold text-zinc-950">{project.projectName}</p>
                        <Badge tone={project.status === "active" ? "sky" : "neutral"}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-zinc-600">
                        {client?.clientName || "Unknown client"} ·{" "}
                        {formatCurrency(project.price, project.currency)}
                      </p>
                      <p className="mt-3 text-xs text-zinc-500">
                        Updated {formatDateTime(project.updatedAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-zinc-950">Quick actions</h3>
            <div className="mt-5 space-y-3">
              {[
                { label: "New Client", to: "/clients", icon: Plus },
                { label: "New Project", to: "/projects", icon: BriefcaseBusiness },
                { label: "Create Proposal", to: "/proposal", icon: FileText },
                { label: "Create Invoice", to: "/invoice", icon: ReceiptText },
              ].map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="focus-ring flex items-center justify-between rounded-lg border border-zinc-200 bg-stone-50 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:bg-white hover:shadow-sm"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                      <span className="truncate">{action.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">Recent documents</h3>
                <p className="mt-1 text-sm text-zinc-600">Saved outputs ready for export.</p>
              </div>
              <Badge tone="amber">{documents.length}</Badge>
            </div>
            {recentDocuments.length === 0 ? (
              <EmptyState
                title="No saved documents"
                description="Generate and save a document to make it available in the Export Center."
              />
            ) : (
              <div className="space-y-3">
                {recentDocuments.map((document) => (
                  <div
                    className="rounded-lg border border-zinc-200 bg-stone-50 p-4"
                    key={document.id}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-zinc-950">{document.title}</p>
                      <Badge tone="neutral">{documentTypeLabel(document.type)}</Badge>
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">
                      Created {formatDateTime(document.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default Dashboard;
