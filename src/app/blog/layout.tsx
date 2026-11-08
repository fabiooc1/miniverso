import { SectionRenderer } from "@/features/sections/components/section-renderer";
import { SiteHeader } from "@/features/sections/components/site-header";
import { getLandingSections } from "@/features/sections/queries";

export default async function BlogLayout({ children }: LayoutProps<"/blog">) {
  const sections = await getLandingSections();
  const footer = sections.find((section) => section.key === "footer");

  return (
    <>
      <SiteHeader tone="light" />
      {children}
      {footer && <SectionRenderer section={footer} />}
    </>
  );
}
