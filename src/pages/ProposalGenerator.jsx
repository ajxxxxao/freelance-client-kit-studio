import { Copy, Download, FilePlus2, Printer, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Notice from "../components/common/Notice.jsx";
import SelectField from "../components/common/SelectField.jsx";
import TextArea from "../components/common/TextArea.jsx";
import DocumentPreview from "../components/preview/DocumentPreview.jsx";
import {
  getClients,
  getProjects,
  getSettings,
  saveGeneratedDocument,
} from "../services/storageService.js";
import {
  copyToClipboard,
  exportMarkdown,
  exportPDF,
} from "../services/exportService.js";
import {
  buildTemplateVariables,
  getProposalTemplates,
  getTemplateById,
  renderTemplate,
} from "../services/templateService.js";
import {
  findById,
  getProjectDisplayName,
  orderProjectsByClient,
} from "../utils/generatorHelpers.js";
import PageShell from "./PageShell.jsx";

const proposalTemplates = getProposalTemplates();

function ProposalGenerator() {
  const [clients, setClients] = useState([]);
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    proposalTemplates[0]?.id || "",
  );
  const [settings, setSettings] = useState({});

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
    getTemplateById("proposal", selectedTemplateId) || proposalTemplates[0];
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

    const variables = buildTemplateVariables(selectedClient, selectedProject, settings);
    const renderedTemplate = renderTemplate(selectedTemplate, variables);

    setContent(renderedTemplate.content || "");
    setNotice("Proposal generated. You can edit it before saving.");
  }

  async function handleCopy() {
    if (!content.trim()) {
      setNotice("Generate or enter proposal content before copying.");
      return;
    }

    const copied = await copyToClipboard(content);
    setNotice(copied ? "Proposal copied to clipboard." : "Copy failed.");
  }

  function handleExportMarkdown() {
    if (!content.trim()) {
      setNotice("Generate proposal content before exporting.");
      return;
    }

    exportMarkdown(`Proposal - ${projectDisplayName}`, content);
    setNotice("Proposal Markdown export started.");
  }

  function handleExportPDF() {
    if (!content.trim()) {
      setNotice("Generate proposal content before exporting.");
      return;
    }

    const exported = exportPDF(`Proposal - ${projectDisplayName}`, content);
    setNotice(exported ? "Proposal print window opened." : "Unable to open print window.");
  }

  function handleSave() {
    if (!selectedClient || !selectedProject || !content.trim()) {
      setNotice("Generate proposal content before saving.");
      return;
    }

    saveGeneratedDocument({
      type: "proposal",
      title: `Proposal - ${projectDisplayName}`,
      clientId: selectedClient.id,
      projectId: selectedProject.id,
      content,
      metadata: {
        templateName: selectedTemplate?.name || "",
      },
    });
    setNotice("Proposal saved to Generated Documents.");
  }

  return (
    <PageShell
      description="Generate polished proposal drafts from local client and project context."
      eyebrow="Generator"
      title="Proposal Generator"
    >
      {!canUseGenerator ? (
        <Card>
          <EmptyState
            description="Create at least one client and one project before generating client-ready proposals."
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
              <h3 className="text-base font-semibold text-zinc-950">Document inputs</h3>
              <div className="mt-5 space-y-4">
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
                  label="Proposal template"
                  onChange={(event) => setSelectedTemplateId(event.target.value)}
                  value={selectedTemplateId}
                >
                  {proposalTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </SelectField>
                <Button className="w-full" type="button" onClick={handleGenerate}>
                  <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                  Generate proposal
                </Button>
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950">Editable content</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Saved documents use the edited version below.
                  </p>
                </div>
              </div>
              <TextArea
                onChange={(event) => setContent(event.target.value)}
                placeholder="Generate a proposal to edit the content here."
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
                  onClick={handleExportMarkdown}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export Markdown
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

          <DocumentPreview content={content} title="Proposal preview" />
        </div>
      )}
    </PageShell>
  );
}

export default ProposalGenerator;
