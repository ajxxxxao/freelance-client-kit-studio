function SelectField({ children, error, label, id, className = "", ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      ) : null}
      <select
        id={id}
        className={[
          "focus-ring block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export default SelectField;
