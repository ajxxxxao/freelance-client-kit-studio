import { FilePlus2 } from "lucide-react";
import Button from "./Button.jsx";

function EmptyState({
  title = "Nothing here yet",
  description = "Create your first record to start building client-ready documents.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-stone-50 px-5 py-10 text-center sm:px-6">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white text-teal-600 shadow-sm ring-1 ring-zinc-200">
        <FilePlus2 className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>
      {actionLabel ? (
        <Button className="mt-5 w-full sm:w-auto" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
