import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const factsText = [
  "Bananas are naturally radioactive — proof science hides in everyday life.",
  "Sharks are older than trees — nature shows true resilience.",
  "Octopuses have three hearts — efficiency comes in unexpected forms.",
  "The first computer bug was a moth — small flaws can spark big lessons.",
  "Most internet traffic runs under the sea — solutions are often unseen.",
  "Your phone outpowers the Apollo 11 computer — constraints drive innovation.",
  "The Eiffel Tower grows taller in heat — designs should adapt, not resist.",
  "Velcro came from burrs — nature is the best engineer.",
  "Bridges can wobble with rhythm — harmony and imbalance shape systems.",
  "Zero changed civilization — sometimes nothing is everything.",
  "Prime numbers protect the internet — randomness can be strength.",
  "The golden ratio appears in shells and galaxies — math is nature’s design.",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Facts: React.FC = () => {
  const [facts] = React.useState(() => shuffle(factsText));

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Science Facts — small sparks, big wonder
          </h2>
          <p className="text-foreground/80 mt-2 max-w-3xl mx-auto">
            A rotating gallery of ideas that show how science and math show up in everyday life.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {facts.map((f, i) => (
            <Card key={i} className="h-full bg-white/60 border-white/60 shadow-elegant hover:-translate-y-0.5 hover:shadow-xl transition-transform">
              <CardContent className="p-5">
                <p className="text-foreground/90 leading-relaxed">{f}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facts;
