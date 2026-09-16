import { Hero } from "@/components/home/hero/hero";
import { PageEffects } from "@/components/primitives/page-effects";

export default function HomePage() {
  return (
    <>
      <PageEffects />
      <main id="top">
        <Hero />
      </main>
    </>
  );
}
