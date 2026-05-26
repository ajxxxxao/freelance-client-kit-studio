function InvoicePreview({ content, invoiceNumber = "INV-0001" }) {
  const hasContent = typeof content === "string" && content.trim().length > 0;

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-6 border-b border-zinc-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Invoice
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-950">{invoiceNumber}</h3>
        </div>
        <div className="text-right text-sm text-zinc-600">
          <p>Client-ready preview</p>
          <p>Local browser data</p>
        </div>
      </div>
      {hasContent ? (
        <pre className="max-h-[72vh] overflow-auto whitespace-pre-wrap break-words py-6 font-sans text-sm leading-7 text-zinc-700">{content}</pre>
      ) : (
        <>
          <div className="grid gap-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-zinc-950">Bill to</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Select a client to populate invoice details.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950">Project</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Select a project to calculate service amount.
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-stone-50 p-4 text-sm text-zinc-600">
            Generated invoice content will appear here before you save it.
          </div>
        </>
      )}
    </div>
  );
}

export default InvoicePreview;
