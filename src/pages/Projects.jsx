import { CalendarDays, Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Modal from "../components/common/Modal.jsx";
import ProjectForm from "../components/forms/ProjectForm.jsx";
import {
  deleteProject,
  getClients,
  getProjects,
  getSettings,
  saveProject,
} from "../services/storageService.js";
import { projectStatuses } from "../utils/constants.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import PageShell from "./PageShell.jsx";

const statusTone = {
  draft: "neutral",
  active: "sky",
  delivered: "emerald",
  archived: "amber",
};

function getStatusLabel(status) {
  return projectStatuses.find((item) => item.value === status)?.label || "Draft";
}

function Projects() {
  const [clients, setClients] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [editingProject, setEditingProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setClients(getClients());
    setProjects(getProjects());
    setDefaultCurrency(getSettings().defaultCurrency || "USD");
  }, []);

  const clientById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  );

  function openCreateModal() {
    setEditingProject(null);
    setIsFormOpen(true);
  }

  function openEditModal(project) {
    setEditingProject(project);
    setIsFormOpen(true);
  }

  function closeFormModal() {
    setEditingProject(null);
    setIsFormOpen(false);
  }

  function handleSaveProject(project) {
    saveProject(project);
    setProjects(getProjects());
    closeFormModal();
  }

  function handleDeleteProject() {
    if (!projectToDelete) {
      return;
    }

    setProjects(deleteProject(projectToDelete.id));
    setProjectToDelete(null);
  }

  return (
    <>
      <PageShell
        description="Track service engagements, connect each project to a client, and reuse that context across generated documents."
        eyebrow="Pipeline"
        title="Projects"
        actions={
          <Button type="button" onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add project
          </Button>
        }
      >
        <Card>
          <div className="mb-5">
            <h3 className="text-base font-semibold text-zinc-950">Project list</h3>
            <p className="mt-1 text-sm text-zinc-600">
              {projects.length} {projects.length === 1 ? "project" : "projects"} stored in this browser.
            </p>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              actionLabel="Add project"
              description="Projects are bound to clients and reused in proposal, invoice, contract, and email flows."
              onAction={openCreateModal}
              title="No projects yet"
            />
          ) : (
            <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
              {projects.map((project) => {
                const client = clientById.get(project.clientId);

                return (
                  <article
                    className="grid gap-4 bg-white p-4 transition hover:bg-stone-50 xl:grid-cols-[1fr_auto]"
                    key={project.id}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="truncate text-base font-semibold text-zinc-950">
                          {project.projectName}
                        </h4>
                        <Badge tone={statusTone[project.status] || "neutral"}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600">
                        {client?.clientName || "Deleted client"} · {project.serviceType}
                      </p>
                      <div className="mt-3 grid gap-2 text-sm text-zinc-600 md:grid-cols-3">
                        <span className="font-medium text-zinc-800">
                          {formatCurrency(project.price, project.currency)}
                        </span>
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                          Due {formatDate(project.dueDate)}
                        </span>
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                      {project.scope ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                          {project.scope}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-start gap-2 xl:justify-end">
                      <Button
                        className="h-9 px-3"
                        type="button"
                        variant="secondary"
                        onClick={() => openEditModal(project)}
                      >
                        <Edit3 className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        className="h-9 px-3"
                        type="button"
                        variant="ghost"
                        onClick={() => setProjectToDelete(project)}
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
      </PageShell>

      <Modal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        title={editingProject ? "Edit project" : "Add project"}
      >
        {clients.length === 0 ? (
          <EmptyState
            description="Projects must be connected to a client. Add at least one client before creating a project."
            title="Create a client first"
          />
        ) : (
          <ProjectForm
            clients={clients}
            defaultCurrency={defaultCurrency}
            initialValues={editingProject}
            onCancel={closeFormModal}
            onSubmit={handleSaveProject}
            submitLabel={editingProject ? "Save changes" : "Create project"}
          />
        )}
        {clients.length === 0 ? (
          <div className="mt-4 flex justify-center">
            <Button as={Link} to="/clients">
              Go to Clients
            </Button>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        description={
          projectToDelete
            ? `Delete ${projectToDelete.projectName}? This removes the project record from local storage.`
            : "Delete this project?"
        }
        isOpen={Boolean(projectToDelete)}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete project"
      />
    </>
  );
}

export default Projects;
