import { createFileRoute } from "@tanstack/react-router";
import { Page, Reveal, Eyebrow } from "@/components/site/Page";
import { Scramble } from "@/components/site/Scramble";


export const Route = createFileRoute("/approach")({
  head: () => ({
    meta: [
      { title: "The Loop — Erchomai Approach" },
      {
        name: "description",
        content:
          "Research, simulation, execution, feedback: the four-stage loop Erchomai uses to engineer intelligent systems.",
      },
      { property: "og:title", content: "The Loop — Erchomai Approach" },
      {
        property: "og:description",
        content:
          "Defining the physics of the problem, building the sandbox, deploying the architecture, and letting the system learn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApproachPage,
});

const STAGES = [
  {
    n: "01",
    title: "Research",
    body: "Defining the physics of the problem. Mapping constraints before execution, so the solution space is understood rather than guessed.",
  },
  {
    n: "02",
    title: "Simulation",
    body: "Building the sandbox. Stress-testing mathematical formulas and turnover constraints in high-concurrency environments until the model breaks — then rebuilding it so it doesn't.",
  },
  {
    n: "03",
    title: "Execution",
    body: "Deploying the architecture. Minimal, full-stack machine learning pipelines with no ornamental complexity between signal and outcome.",
  },
  {
    n: "04",
    title: "Feedback",
    body: "The system learns and the cycle repeats. Every deployment returns evidence to research, and the loop tightens.",
  },
];

function ApproachPage() {
  return (
    <Page>
      <section className="px-6 pb-24 pt-40 md:px-12 md:pb-40 md:pt-56">
        <Reveal>
          <Eyebrow>The Loop</Eyebrow>
          <Scramble
            as="h1"
            text="A method, not a service."
            className="mt-8 block max-w-[14ch] text-[13vw] font-extralight uppercase leading-[0.88] tracking-[-0.02em] md:text-[7vw]"
          />

        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[46ch] text-sm font-light leading-relaxed text-titanium md:ml-[52%] md:mt-16 md:text-base">
            Four stages, run continuously. Each one exists to make the next one cheaper, faster
            and more certain than the last.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-porcelain/10">
        {STAGES.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05}>
            <article className="grid gap-6 border-b border-porcelain/10 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-12 md:py-28">
              <p className="text-[10px] font-light tracking-[0.4em] text-titanium md:col-span-2">
                {s.n}
              </p>
              <Scramble
                as="h2"
                text={s.title}
                className="block text-4xl font-extralight uppercase leading-[0.95] tracking-[-0.01em] md:col-span-5 md:text-6xl"
              />

              <p className="max-w-[48ch] text-sm font-light leading-relaxed text-titanium md:col-span-5 md:text-base">
                {s.body}
              </p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="px-6 py-28 md:px-12 md:py-44">
        <Reveal>
          <p className="max-w-[20ch] text-2xl font-extralight uppercase leading-[1.05] text-porcelain md:text-5xl">
            Then it begins <span className="text-titanium">again.</span>
          </p>
        </Reveal>
      </section>
    </Page>
  );
}
