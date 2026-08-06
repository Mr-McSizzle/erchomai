import { createFileRoute } from "@tanstack/react-router";
import { Page, Reveal, Eyebrow } from "@/components/site/Page";
import { Magnetic } from "@/components/site/Magnetic";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Initiation — Contact Erchomai" },
      {
        name: "description",
        content:
          "Begin the conversation. Reach Erchomai at krishmehan24@gmail.com or +91 9833245503 and book a consultation.",
      },
      { property: "og:title", content: "Initiation — Contact Erchomai" },
      {
        property: "og:description",
        content: "One line of contact. Book a consultation with Erchomai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <Page>
      <section className="flex min-h-screen flex-col justify-between px-6 pb-16 pt-40 md:px-12 md:pb-20 md:pt-56">
        <Reveal>
          <Eyebrow>Initiation</Eyebrow>
        </Reveal>

        <div className="py-16">
          <Reveal>
            <a
              href="mailto:krishmehan24@gmail.com"
              className="block break-all text-[8vw] font-extralight leading-[1.02] tracking-[-0.02em] text-porcelain transition-colors hover:text-titanium md:text-[4.4vw]"
            >
              krishmehan24@gmail.com
            </a>
          </Reveal>
          <Reveal delay={0.08}>
            <a
              href="tel:+919833245503"
              className="mt-6 block text-[8vw] font-extralight leading-[1.02] tracking-[-0.02em] text-porcelain transition-colors hover:text-titanium md:mt-10 md:text-[4.4vw]"
            >
              +91 9833245503
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="flex flex-col gap-8 border-t border-porcelain/10 pt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[34ch] text-sm font-light leading-relaxed text-titanium">
              Bring a problem with constraints. We will tell you whether it can be simulated before
              anyone writes a line of production code.
            </p>
            <a
              href="mailto:krishmehan24@gmail.com?subject=Consultation"
              className="inline-flex items-center justify-center border border-porcelain/25 px-10 py-5 text-[10px] font-light uppercase tracking-[0.45em] text-porcelain transition-colors duration-300 hover:border-emerald hover:bg-emerald hover:text-obsidian"
            >
              Book a Consultation
            </a>
          </div>
        </Reveal>
      </section>
    </Page>
  );
}
