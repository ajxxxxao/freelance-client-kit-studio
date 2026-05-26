import { Copy, Download, Mail, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Notice from "../components/common/Notice.jsx";
import SelectField from "../components/common/SelectField.jsx";
import TextArea from "../components/common/TextArea.jsx";
import TextInput from "../components/common/TextInput.jsx";
import DocumentPreview from "../components/preview/DocumentPreview.jsx";
import {
  getClients,
  getProjects,
  getSettings,
  saveGeneratedDocument,
} from "../services/storageService.js";
import { copyToClipboard, exportMarkdown } from "../services/exportService.js";
import {
  buildTemplateVariables,
  getEmailTemplates,
  getTemplateById,
  renderTemplate,
} from "../services/templateService.js";
import {
  buildEmailContent,
  findById,
  getProjectDisplayName,
  orderProjectsByClient,
} from "../utils/generatorHelpers.js";
import PageShell from "./PageShell.jsx";

const emailTemplates = getEmailTemplates();

function EmailTemplates() {
  const [body, setBody] = useState("");
  const [clients, setClients] = useState([]);
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(emailTemplates[0]?.id || "");
  const [settings, setSettings] = useState({});
  const [subject, setSubject] = useState("");

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
  const selectedTemplate = getTemplateById("email", selectedTemplateId) || emailTemplates[0];
  const projectDisplayName = getProjectDisplayName(selectedProject);
  const canUseGenerator = clients.length > 0 && projects.length > 0;
  const fullEmailContent = buildEmailContent(subject, body);

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

    setSubject(renderedTemplate.subject || "");
    setBody(renderedTemplate.body || "");
    setNotice("Email generated. You can edit it before saving.");
  }

  async function handleCopy() {
    if (!fullEmailContent.trim()) {
      setNotice("Generate or enter email content before copying.");
      return;
    }

    const copied = await copyToClipboard(fullEmailContent);
    setNotice(copied ? "Email copied to clipboard." : "Copy failed.");
  }

  function handleExportMarkdown() {
    if (!fullEmailContent.trim()) {
      setNotice("Generate email content before exporting.");
      return;
    }

    exportMarkdown(
      `${selectedTemplate?.name || "Email"} - ${projectDisplayName}`,
      fullEmailContent,
    );
    setNotice("Email Markdown export started.");
  }

  function handleSave() {
    if (!selectedClient || !selectedProject || !fullEmailContent.trim()) {
      setNotice("Generate email content before saving.");
      return;
    }

    saveGeneratedDocument({
      type: "email",
      title: `${selectedTemplate?.name || "Email"} - ${projectDisplayName}`,
      clientId: selectedClient.id,
      projectId: selectedProject.id,
      content: fullEmailContent,
      metadata: {
        templateName: selectedTemplate?.name || "",
      },
    });
    setNotice("Email saved to Generated Documents.");
  }

  return (
    <PageShell
      description="Choose reusable client emails and replace variables with selected client and project details."
      eyebrow="Templates"
      title="Email Templates"
    >
      {!canUseGenerator ? (
        <Card>
          <EmptyState
            description="Create at least one client and one project before generating reusable client emails."
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
              <h3 className="text-base font-semibold text-zinc-950">Template inputs</h3>
              <div className="mt-5 space-y-4">
                <SelectField
                  label="Email template"
                  onChange={(event) => setSelectedTemplateId(event.target.value)}
                  value={selectedTemplateId}
                >
                  {emailTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </SelectField>
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
                <Button className="w-full" type="button" onClick={handleGenerate}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Generate email
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-zinc-950">Editable email</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Saved emails use the edited subject and body below.
              </p>
              <div className="mt-4 space-y-4">
                <TextInput
                  label="Subject"
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Email subject"
                  value={subject}
                />
                <TextArea
                  label="Body"
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Generate an email to edit the body here."
                  rows={16}
                  value={body}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  disabled={!fullEmailContent.trim()}
                  type="button"
                  variant="secondary"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copy
                </Button>
                <Button disabled={!fullEmailContent.trim()} type="button" onClick={handleSave}>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save document
                </Button>
                <Button
                  disabled={!fullEmailContent.trim()}
                  type="button"
                  variant="secondary"
                  onClick={handleExportMarkdown}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export Markdown
                </Button>
              </div>
              <div className="mt-4">
                <Notice message={notice} />
              </div>
            </Card>
          </div>

          <DocumentPreview title="Email preview">
            {subject || body ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Subject
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                    {subject || "No subject"}
                  </h3>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-700">{body || "No body content"}</pre>
              </div>
            ) : (
              <p className="text-zinc-500">
                Generated email subject and body will appear here.
              </p>
            )}
          </DocumentPreview>
        </div>
      )}
    </PageShell>
  );
}

export default EmailTemplates;
