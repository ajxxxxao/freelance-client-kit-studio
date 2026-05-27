import { Check, Sparkles } from "lucide-react";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import PageShell from "./PageShell.jsx";

const earlyAccessUrl = "https://tally.so/r/KYaj7X";

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    billing: "local workspace",
    description: "A focused local workspace for getting client documents organized.",
    features: [
      "3 clients",
      "3 projects",
      "Basic templates",
      "Markdown export",
      "Watermark on PDF exports",
    ],
    cta: "Current plan",
    highlighted: false,
  },
  {
    name: "Pro Plan",
    price: "$9",
    billing: "one-time",
    description: "A professional document kit for freelancers managing ongoing client work.",
    features: [
      "Unlimited clients",
      "Unlimited projects",
      "PDF export",
      "Premium templates",
      "Remove watermark",
      "Client-ready document design",
      "Priority template updates",
    ],
    cta: "Join Early Access",
    href: earlyAccessUrl,
    highlighted: true,
  },
];

function Upgrade() {
  return (
    <PageShell
      description="Plan packaging for a future paid version. Checkout is not enabled in this local workspace."
      eyebrow="Plans"
      title="Upgrade"
    >
      <Card className="bg-zinc-950 text-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Freelance Client Kit Studio
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Built to become a paid client operations tool.
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              The current product runs locally in the browser while keeping room for future
              checkout, premium templates, and client-ready document design.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4 text-sm text-zinc-200">
            No account required. No cloud sync. Your records stay in local browser storage.
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? "border-teal-200 bg-gradient-to-b from-white to-teal-50"
                : ""
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-zinc-950">{plan.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{plan.description}</p>
              </div>
              {plan.highlighted ? (
                <div className="rounded-lg bg-teal-600 p-2 text-white">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-zinc-950">
                {plan.price}
              </span>
              <span className="pb-1 text-sm text-zinc-500">{plan.billing}</span>
            </div>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700">
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
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

export default Upgrade;
