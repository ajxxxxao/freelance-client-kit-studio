function TextArea({ error, label, id, className = "", rows = 4, ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      ) : null}
      <textarea
        id={id}
        rows={rows}
        className={[
          "focus-ring block w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export default TextArea;
