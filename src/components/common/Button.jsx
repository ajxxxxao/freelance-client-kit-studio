const variants = {
  primary: "bg-teal-600 text-white hover:bg-teal-700",
  secondary: "bg-white text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:bg-stone-50",
  ghost: "bg-transparent text-zinc-600 hover:bg-stone-100 hover:text-zinc-950",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

function Button({
  as: Component = "button",
  children,
  className = "",
  type,
  variant = "primary",
  ...props
}) {
  const resolvedType = Component === "button" ? type || "button" : type;

  return (
    <Component
      className={[
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-center text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
        className,
      ].join(" ")}
      type={resolvedType}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
