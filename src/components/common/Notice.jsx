const toneClasses = {
  success: "border-teal-200 bg-teal-50 text-teal-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  neutral: "border-zinc-200 bg-stone-50 text-zinc-700",
};

function inferTone(message) {
  const normalizedMessage = String(message || "").toLowerCase();

  if (
    normalizedMessage.includes("failed") ||
    normalizedMessage.includes("unable") ||
    normalizedMessage.includes("before") ||
    normalizedMessage.includes("choose") ||
    normalizedMessage.includes("required")
  ) {
    return "error";
  }

  return "success";
}

function Notice({ message, tone }) {
  if (!message) {
    return null;
  }

  const resolvedTone = tone || inferTone(message);

  return (
    <div
      className={[
        "rounded-lg border px-3 py-2 text-sm font-medium",
        toneClasses[resolvedTone] || toneClasses.neutral,
      ].join(" ")}
    >
      {message}
    </div>
  );
}

export default Notice;
