import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/erchomai/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Erchomai — The Future, Arrived." },
      {
        name: "description",
        content:
          "Erchomai engineers intelligence around human ambition: research, simulation, forecasting, synthetic markets and execution in one continuous system.",
      },
      { property: "og:title", content: "Erchomai — The Future, Arrived." },
      {
        property: "og:description",
        content:
          "An immersive study in engineered intelligence. Human ambition, wrapped in a parametric exoskeleton of simulation and execution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Experience />;
}
