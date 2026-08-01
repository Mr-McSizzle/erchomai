import { createFileRoute } from "@tanstack/react-router";
import { Page, Reveal, Eyebrow } from "@/components/site/Page";
import { Scramble } from "@/components/site/Scramble";


export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Erchomai Case Studies" },
      {
        name: "description",
        content:
          "Two technical deep dives: Project Pragati-Setu, a macroeconomic simulation model, and Resqnet OS, high-concurrency drone telemetry tracking.",
      },
      { property: "og:title", content: "Work — Erchomai Case Studies" },
      {
        property: "og:description",
        content:
          "Macroeconomic simulation and high-concurrency drone telemetry, engineered end to end.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});

const TERMINAL_A = `$ erchomai run --model pragati-setu
[sys] operator ......... 24BAI1086
[sys] horizon .......... 48 quarters
[sim] shocks ........... 12,000 paths
[sim] convergence ...... 0.9987
[out] policy surface ... written`;

const TERMINAL_B = `$ resqnet --telemetry --live
[sys] node ............. 24BAI1086
[net] fleet ............ 512 units
[net] ingest ........... 18.4k msg/s
[trk] p99 latency ...... 41 ms
[ok ] state machine .... nominal`;

function Bars() {
  const heights = [34, 58, 22, 71, 46, 88, 30, 64, 41, 77, 25, 55];
  return (
    <div className="flex h-24 items-end gap-1.5">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ height: `${h}%` }}
          className="w-full bg-porcelain/25 transition-colors duration-500 group-hover:bg-emerald/60"
        />
      ))}
    </div>
  );
}

function Terminal({ code }: { code: string }) {
  return (
    <pre className="w-full min-w-0 max-w-full overflow-x-auto whitespace-pre-wrap break-words border border-porcelain/10 bg-porcelain/[0.03] p-4 font-mono text-[10px] leading-relaxed text-titanium sm:whitespace-pre sm:p-5 sm:text-[11px] md:text-xs">
      {code}
    </pre>
  );
}

function WorkPage() {
  return (
    <Page>
      <section className="px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-56">
        <Reveal>
          <Eyebrow>Selected Work</Eyebrow>
          <Scramble
            as="h1"
            text="Systems in production."
            className="mt-8 block max-w-[16ch] text-[12vw] font-extralight uppercase leading-[0.88] tracking-[-0.02em] md:text-[6.5vw]"
          />

        </Reveal>
      </section>

      <section className="space-y-px bg-porcelain/10">
        <Reveal>
          <article className="group grid gap-10 bg-obsidian px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-24">
            <div className="min-w-0 md:col-span-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald">
                Case 01 / Simulation
              </p>
              <Scramble
                as="h2"
                text={"Project\nPragati-Setu"}
                className="mt-6 block whitespace-pre-line text-4xl font-extralight uppercase leading-[0.95] md:text-6xl"
              />

              <p className="mt-8 max-w-[52ch] text-sm font-light leading-relaxed text-titanium md:text-base">
                A macroeconomic simulation and analytical thinking model. Policy levers, capital
                flows and demographic pressure are expressed as a single differentiable system, then
                driven through twelve thousand stochastic paths to expose which interventions survive
                contact with reality.
              </p>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-porcelain/10 pt-6 text-[10px] uppercase tracking-[0.25em] text-titanium">
                {[
                  ["Domain", "Macro"],
                  ["Paths", "12k"],
                  ["Horizon", "48Q"],
                ].map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt>{k}</dt>
                    <dd className="mt-2 font-mono text-base tracking-normal text-porcelain">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="min-w-0 space-y-6 md:col-span-6">
              <Bars />
              <Terminal code={TERMINAL_A} />
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="group grid gap-10 bg-obsidian px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-24">
            <div className="min-w-0 space-y-6 md:order-2 md:col-span-6">
              <Bars />
              <Terminal code={TERMINAL_B} />
            </div>
            <div className="min-w-0 md:col-span-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald">
                Case 02 / Telemetry
              </p>
              <h2 className="mt-6 text-4xl font-extralight uppercase leading-[0.95] md:text-6xl">
                Resqnet
                <br />
                OS
              </h2>
              <p className="mt-8 max-w-[52ch] text-sm font-light leading-relaxed text-titanium md:text-base">
                Drone telemetry simulation and high-concurrency tracking. A fleet-scale ingest layer
                holds hundreds of airframes in a single consistent world model, with sub-50ms tail
                latency on position, battery and mission state under sustained load.
              </p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-titanium">
                Co-architects — Niketh, Pranjal
              </p>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-porcelain/10 pt-6 text-[10px] uppercase tracking-[0.25em] text-titanium">
                {[
                  ["Fleet", "512"],
                  ["Ingest", "18.4k/s"],
                  ["P99", "41ms"],
                ].map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt>{k}</dt>
                    <dd className="mt-2 font-mono text-base tracking-normal text-porcelain">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </Reveal>
      </section>
    </Page>
  );
}
