function Card({ children, className = "" }) {
  return (
    <section
      className={[
        "min-w-0 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export default Card;
