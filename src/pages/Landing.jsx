import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileCheck2,
  FileText,
  Inbox,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";

const features = [
  {
    title: "Proposal Generator",
    description: "Turn client and project context into concise, client-ready proposals.",
    icon: FileText,
  },
  {
    title: "Invoice Generator",
    description: "Create simple invoices with totals, tax fields, and payment details.",
    icon: ReceiptText,
  },
  {
    title: "Contract Terms",
    description: "Prepare practical service terms with a clear business-use disclaimer.",
    icon: FileCheck2,
  },
  {
    title: "Email Templates",
    description: "Send consistent project updates, follow-ups, delivery notes, and reminders.",
    icon: Mail,
  },
];

const workflow = [
  "Add clients",
  "Create projects",
  "Generate documents",
  "Copy or export",
];

const earlyAccessUrl = "https://tally.so/r/KYaj7X";

const audiences = [
  "Freelance designers",
  "Freelance developers",
  "Marketing consultants",
  "SEO consultants",
  "Copywriters",
  "Virtual assistants",
  "Small service teams",
  "Solo operators",
];

const pricingPlans = [
  {
    name: "Free Plan",
    price: "$0",
    billing: "local workspace",
    features: [
      "3 clients",
      "3 projects",
      "Basic templates",
      "Markdown export",
      "Watermark on PDF exports",
    ],
    highlighted: false,
    cta: "Current plan",
  },
  {
    name: "Pro Plan",
    price: "$9",
    billing: "one-time",
    features: [
      "Unlimited clients",
      "Unlimited projects",
      "PDF export",
      "Premium templates",
      "Remove watermark",
      "Client-ready document design",
      "Priority template updates",
    ],
    highlighted: true,
    cta: "Join Early Access",
    href: earlyAccessUrl,
  },
];

const faqs = [
  {
    question: "Is my data stored in the cloud?",
    answer:
      "No. Client, project, and document data are stored in your browser using LocalStorage.",
  },
  {
    question: "Do I need an account?",
    answer: "No. The current version works without login or account setup.",
  },
  {
    question: "Can I export documents?",
    answer:
      "Yes. You can export Markdown, CSV, and browser print PDF depending on the document type.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "No. Contract terms are general business templates and do not constitute legal advice.",
  },
  {
    question: "Who is this for?",
    answer:
      "Freelancers, consultants, solo service providers, and small client-service teams.",
  },
  {
    question: "Will there be a Pro version?",
    answer:
      "The Pro version is planned as a lightweight one-time upgrade for premium templates and client-ready exports.",
  },
];

function LandingMockup() {
  return (
    <div className="pointer-events-none mx-auto w-full max-w-[640px] overflow-hidden rounded-lg border border-white/15 bg-white text-zinc-950 shadow-2xl lg:mx-0 lg:ml-auto">
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
        <span className="ml-3 truncate text-xs font-medium text-zinc-500">
          Freelance Client Kit Studio
        </span>
      </div>

      <div className="grid min-w-0 grid-cols-[128px_minmax(0,1fr)] sm:grid-cols-[168px_minmax(0,1fr)]">
        <div className="border-r border-zinc-200 bg-zinc-950 p-3 text-white sm:p-4">
          <div className="h-8 w-8 rounded-lg bg-teal-500" />
          <div className="mt-6 space-y-2">
            {["Dashboard", "Clients", "Projects", "Proposal"].map((item, index) => (
              <div
                className={[
                  "truncate rounded-lg px-2.5 py-2 text-xs sm:text-sm",
                  index === 0 ? "bg-white/12 text-white" : "text-zinc-400",
                ].join(" ")}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-stone-100 p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-teal-700">Workspace</p>
              <p className="mt-1 truncate text-lg font-semibold text-zinc-950">
                Client document studio
              </p>
            </div>
            <div className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white">
              Create Proposal
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Clients: 3", value: "3" },
              { label: "Projects: 3", value: "3" },
              { label: "Documents: 8", value: "8" },
              { label: "Active projects: 2", value: "2" },
            ].map((metric, index) => (
              <div
                className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm"
                key={metric.label}
              >
                <p className="truncate text-[11px] font-medium text-zinc-500">
                  {metric.label}
                </p>
                <div className="mt-3 text-2xl font-semibold text-zinc-950">{metric.value}</div>
                <div
                  className={[
                    "mt-3 h-7 w-7 rounded-lg",
                    index % 2 === 0 ? "bg-teal-100" : "bg-amber-100",
                  ].join(" ")}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-zinc-950">Recent documents</p>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-800">
                8 saved
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Proposal - Website Redesign",
                "Invoice - Website Redesign",
                "Contract Terms - Website Redesign",
              ].map(
                (item, index) => (
                  <div className="rounded-lg border border-zinc-200 bg-stone-50 p-3" key={item}>
                    <div className="flex min-w-0 items-center justify-between gap-3 text-xs">
                      <p className="truncate font-semibold text-zinc-900">{item}</p>
                      <div
                        className={[
                          "shrink-0 rounded-full px-2 py-1 font-medium",
                          index === 0
                            ? "bg-sky-100 text-sky-800"
                            : index === 1
                              ? "bg-teal-100 text-teal-800"
                              : "bg-amber-100 text-amber-800",
                        ].join(" ")}
                      >
                        {index === 0 ? "Proposal" : index === 1 ? "Invoice" : "Terms"}
                      </div>
                    </div>
                    <p className="mt-2 truncate text-xs text-zinc-500">
                      Client: Northstar Studio · Project: Website Redesign
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white/95">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link className="flex min-w-0 items-center gap-3" to="/landing">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-600 text-white">
              <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="truncate text-sm font-semibold text-zinc-950">
              Freelance Client Kit Studio
            </span>
          </Link>
          <nav className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Button as={Link} to="/" variant="ghost">
              Open Workspace
            </Button>
            <Button as="a" href="#pricing" variant="secondary">
              View Plans
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="overflow-hidden border-b border-zinc-800 bg-zinc-950 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center lg:gap-12 lg:px-8 lg:py-24">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
                Freelance Client Kit Studio
              </p>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold sm:text-5xl">
                Client-ready documents for freelancers, generated in minutes.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300">
                Create proposals, invoices, contract terms, and client emails from one simple
                local-first workspace. No account, no backend, no cloud sync required.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button as={Link} to="/">
                  Open Workspace
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button as="a" href="#pricing" variant="secondary">
                  View Pricing
                </Button>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
                {["No account required", "Private by default", "Stored in your browser"].map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <ShieldCheck className="h-4 w-4 text-teal-300" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <LandingMockup />
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal-700">Client-ready output</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                Turn client details into polished business documents.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    className="rounded-lg border border-zinc-200 bg-stone-50 p-5"
                    key={feature.title}
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-zinc-950">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-teal-700">Who It's For</p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950">
                Built for solo service providers who need to look professional fast.
              </h2>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((audience) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  key={audience}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-zinc-800">{audience}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-teal-700">Simple workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                Move from client context to exportable documents in minutes.
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                Add your client, define the project, generate the document, then copy or export the
                final version.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {workflow.map((step, index) => (
                <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm" key={step}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-zinc-950">{step}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-950 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="scroll-mt-8 border-y border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal-700">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950">
                Start free, with a planned one-time Pro upgrade.
              </h2>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {pricingPlans.map((plan) => (
                <article
                  className={[
                    "rounded-lg border bg-white p-6 shadow-sm",
                    plan.highlighted ? "border-teal-200 bg-teal-50/50" : "border-zinc-200",
                  ].join(" ")}
                  key={plan.name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-950">{plan.name}</h3>
                      <div className="mt-5 flex items-end gap-2">
                        <span className="text-4xl font-semibold text-zinc-950">
                          {plan.price}
                        </span>
                        <span className="pb-1 text-sm text-zinc-500">{plan.billing}</span>
                      </div>
                    </div>
                    {plan.highlighted ? (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-600 text-white">
                        <Sparkles className="h-5 w-5" aria-hidden="true" />
                      </div>
                    ) : null}
                  </div>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li className="flex items-start gap-3 text-sm text-zinc-700" key={feature}>
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-700">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.href ? (
                    <Button
                      as="a"
                      className="mt-8 w-full"
                      href={plan.href}
                      rel="noreferrer"
                      target="_blank"
                      variant="primary"
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      className="mt-8 w-full"
                      disabled
                      type="button"
                      variant="secondary"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {[
              {
                title: "Local-first by design",
                text: "Client records, projects, settings, and generated documents stay in the user's browser storage.",
                icon: ShieldCheck,
              },
              {
                title: "Organized exports",
                text: "Saved documents can be reviewed from Export Center and exported as Markdown, CSV, or print-ready PDF.",
                icon: Inbox,
              },
              {
                title: "$9 one-time Pro packaging",
                text: "The Pro plan is prepared as a future one-time upgrade without checkout logic enabled.",
                icon: Sparkles,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article className="rounded-lg border border-zinc-200 bg-stone-50 p-5" key={item.title}>
                  <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-zinc-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal-700">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950">
                Practical answers before you start.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqs.map((faq) => (
                <article
                  className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
                  key={faq.question}
                >
                  <h3 className="text-base font-semibold text-zinc-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-zinc-200 bg-zinc-950 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-300">Ready for client work</p>
              <h2 className="mt-2 text-2xl font-semibold">
                Start creating client-ready documents without setting up a heavy CRM.
              </h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-300">
                {["Client records", "Project context", "Saved document exports"].map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <Check className="h-4 w-4 text-teal-300" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <Button as={Link} to="/">
              Open Workspace
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
