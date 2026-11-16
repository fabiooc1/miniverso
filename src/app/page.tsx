import { BackToTop } from "@/features/motion/back-to-top";
import { ScrollReveal } from "@/features/motion/scroll-reveal";
import { SectionRenderer } from "@/features/sections/components/section-renderer";
import { SiteHeader } from "@/features/sections/components/site-header";
import { sectionDefinitions } from "@/features/sections/definitions";
import { getLandingSections } from "@/features/sections/queries";

export default async function HomePage() {
  const sections = await getLandingSections();
  // Seções fixas (rodapé) ficam fora do <main>.
  const isFixed = (key: keyof typeof sectionDefinitions) => "fixed" in sectionDefinitions[key];

  return (
    // `data-motion` liga as animações só na página pública (o editor não tem o atributo).
    <div data-motion className="contents">
      <SiteHeader />
      <main className="flex-1">
        {sections
          .filter((section) => !isFixed(section.key))
          .map((section) => (
            <SectionRenderer key={section.key} section={section} />
          ))}
      </main>
      {sections
        .filter((section) => isFixed(section.key))
        .map((section) => (
          <SectionRenderer key={section.key} section={section} />
        ))}
      <ScrollReveal />
      <BackToTop />
    </div>
  );
}
