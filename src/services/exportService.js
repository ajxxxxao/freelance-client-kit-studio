import { sanitizeFilename } from "../utils/formatters.js";

function ensureExtension(filename, extension) {
  const safeName = sanitizeFilename(filename);
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`;

  return safeName.toLowerCase().endsWith(normalizedExtension)
    ? safeName
    : `${safeName}${normalizedExtension}`;
}

function downloadBlob(filename, blob) {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    return false;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

function escapeCSVCell(value) {
  const cell = value === null || value === undefined ? "" : String(value);
  const escapedCell = cell.replace(/"/g, "\"\"");

  if (/[",\n\r]/.test(escapedCell)) {
    return `"${escapedCell}"`;
  }

  return escapedCell;
}

function rowsToCSV(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return "";
  }

  if (Array.isArray(rows[0])) {
    return rows.map((row) => row.map(escapeCSVCell).join(",")).join("\n");
  }

  const headers = Array.from(
    rows.reduce((keys, row) => {
      Object.keys(row || {}).forEach((key) => keys.add(key));
      return keys;
    }, new Set()),
  );
  const body = rows.map((row) => headers.map((header) => escapeCSVCell(row?.[header])).join(","));

  return [headers.map(escapeCSVCell).join(","), ...body].join("\n");
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getPrintableContent(content) {
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;

  if (htmlPattern.test(String(content || ""))) {
    return content;
  }

  return `<pre>${escapeHTML(content)}</pre>`;
}

export function exportMarkdown(filename, content) {
  const safeFilename = ensureExtension(filename, ".md");
  const blob = new Blob([content || ""], {
    type: "text/markdown;charset=utf-8",
  });

  return downloadBlob(safeFilename, blob);
}

export function exportCSV(filename, rows) {
  const safeFilename = ensureExtension(filename, ".csv");
  const csv = rowsToCSV(rows);
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  return downloadBlob(safeFilename, blob);
}

export function exportPDF(title, htmlContent) {
  if (typeof window === "undefined") {
    return false;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    return false;
  }

  const safeTitle = escapeHTML(title || "Document");
  const printableContent = getPrintableContent(htmlContent);

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 40px;
        color: #18181b;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.6;
      }
      h1 {
        margin: 0 0 24px;
        font-size: 24px;
        line-height: 1.2;
      }
      pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
        line-height: 1.7;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border-bottom: 1px solid #e4e4e7;
        padding: 8px;
        text-align: left;
      }
      @media print {
        body { padding: 24px; }
        button { display: none; }
      }
    </style>
  </head>
  <body>
    <h1>${safeTitle}</h1>
    ${printableContent}
    <script>
      window.addEventListener("load", () => {
        window.focus();
        window.print();
      });
    </script>
  </body>
</html>`);
  printWindow.document.close();

  return true;
}

export async function copyToClipboard(content) {
  if (!content) {
    return false;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      // Fall through to the textarea fallback.
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);

  return copied;
}
