import { SectionRenderer } from "@/features/sections/components/section-renderer";
import { SiteHeader } from "@/features/sections/components/site-header";
import { sectionDefinitions } from "@/features/sections/definitions";
import { getLandingSections } from "@/features/sections/queries";

export default async function HomePage() {
  const sections = await getLandingSections();
  // Seções fixas (rodapé) ficam fora do <main>.
  const isFixed = (key: keyof typeof sectionDefinitions) => "fixed" in sectionDefinitions[key];

  return (
    <>
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
    </>
  );
}
