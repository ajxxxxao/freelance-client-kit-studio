import Badge from "../components/common/Badge.jsx";

function PageShell({ actions, badge, children, description, eyebrow, title }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              {eyebrow}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              {title}
            </h2>
            {badge ? <Badge tone="teal">{badge}</Badge> : null}
          </div>
          {description ? (
            <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex w-full flex-wrap gap-3 sm:w-auto">{actions}</div> : null}
      </div>

      {children}
    </div>
  );
}

export default PageShell;
