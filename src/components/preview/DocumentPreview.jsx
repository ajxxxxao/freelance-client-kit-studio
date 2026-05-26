function DocumentPreview({
  children,
  content,
  emptyText = "Generated content will appear here after you choose a client and project.",
  title = "Document preview",
}) {
  const hasContent = typeof content === "string" && content.trim().length > 0;

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      </div>
      <div className="max-h-[72vh] min-h-80 overflow-auto p-5 text-sm leading-7 text-zinc-700">
        {hasContent ? (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-zinc-700">{content}</pre>
        ) : (
          children || <p className="text-zinc-500">{emptyText}</p>
        )}
      </div>
    </div>
  );
}

export default DocumentPreview;
