export function findById(items = [], id) {
  return items.find((item) => item.id === id) || null;
}

export function orderProjectsByClient(projects = [], clientId) {
  if (!clientId) {
    return projects;
  }

  const relatedProjects = projects.filter((project) => project.clientId === clientId);
  const otherProjects = projects.filter((project) => project.clientId !== clientId);

  return [...relatedProjects, ...otherProjects];
}

export function getProjectDisplayName(project, fallback = "Untitled Project") {
  const projectName = String(project?.projectName || "").trim();

  if (projectName.length < 3) {
    return fallback;
  }

  return projectName;
}

export function buildEmailContent(subject, body) {
  if (!subject && !body) {
    return "";
  }

  return `Subject: ${subject || ""}\n\n${body || ""}`.trim();
}
