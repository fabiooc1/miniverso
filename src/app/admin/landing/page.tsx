import type { Metadata } from "next";
import { requireAdmin } from "@/features/auth/session";
import { LandingEditor } from "@/features/sections/editor/landing-editor";
import { getEditorSections } from "@/features/sections/queries";

export const metadata: Metadata = { title: "Landing page" };

export default async function LandingEditorPage() {
  await requireAdmin();
  const sections = await getEditorSections();

  return <LandingEditor initialSections={sections} />;
}
