import { createFileRoute } from "@tanstack/react-router";
import { Page, Reveal, Eyebrow } from "@/components/site/Page";
import { Scramble } from "@/components/site/Scramble";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Philosophy — Erchomai" },
      {
        name: "description",
        content:
          "The human never changes. The world does. Erchomai engineers autonomous systems logic, alpha generation and algorithmic trading architectures.",
      },
      { property: "og:title", content: "Philosophy — Erchomai" },
      {
        property: "og:description",
        content:
          "Tools evolve. The goal never moves: augmenting human capability with engineered intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Page>
      <section className="px-6 pb-20 pt-40 md:px-12 md:pb-32 md:pt-56">
        <Reveal>
          <Eyebrow>Philosophy</Eyebrow>
          <h1 className="mt-10 text-[14vw] font-extralight uppercase leading-[0.82] tracking-[-0.03em] md:text-[9vw]">
            <Scramble text="The human" className="block" />
            <Scramble text="never changes." className="block text-titanium" />
            <Scramble text="The world does." className="block" />
          </h1>
        </Reveal>
      </section>


      <section className="grid gap-12 border-y border-porcelain/10 px-6 py-20 md:grid-cols-2 md:gap-24 md:px-12 md:py-32">
        <Reveal>
          <p className="text-lg font-extralight leading-[1.5] text-porcelain md:text-2xl">
            Ambition, judgement and appetite for risk are constants. Markets, models and machines
            are not. Everything we build sits in that gap.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-8 text-sm font-light leading-relaxed text-titanium md:text-base">
            <p>
              Our work is the engineering of autonomous systems logic: agents that observe, price,
              decide and act without waiting for permission at every step. The discipline is in the
              constraints, not the autonomy.
            </p>
            <p>
              Around that sits alpha generation — signal research held to statistical honesty — and
              the algorithmic trading architectures that carry those signals into live, capital-bearing
              execution with latency, turnover and risk treated as first-class citizens.
            </p>
            <p>
              The tools evolve. Every year the substrate changes shape. The goal does not: augmenting
              human capability, never replacing the human at the centre of the decision.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-40">
        <Reveal>
          <ul className="grid gap-px overflow-hidden border border-porcelain/10 bg-porcelain/10 md:grid-cols-3">
            {[
              ["Autonomous Systems", "Logic that runs unattended, bounded by explicit constraints."],
              ["Alpha Generation", "Research held to evidence, not narrative."],
              ["Execution Architecture", "Latency, turnover and risk as design primitives."],
            ].map(([t, d]) => (
              <li key={t} className="bg-obsidian px-6 py-12 md:px-8 md:py-16">
                <h3 className="text-[10px] font-light uppercase tracking-[0.4em] text-titanium">
                  {t}
                </h3>
                <p className="mt-6 text-base font-extralight leading-snug text-porcelain md:text-lg">
                  {d}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </Page>
  );
}
