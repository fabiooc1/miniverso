import type { Metadata } from "next";
import { PasswordForm } from "@/features/account/components/password-form";
import { ProfileForm } from "@/features/account/components/profile-form";
import { SessionsCard } from "@/features/account/components/sessions-card";
import { listOwnSessions } from "@/features/account/queries";
import { PageContainer } from "@/features/admin/components/page-container";
import { PageHeader } from "@/features/admin/components/page-header";
import { requireAdmin } from "@/features/auth/session";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const { user, session } = await requireAdmin();
  const sessions = await listOwnSessions(session.id);

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader eyebrow="Sistema" title="Minha conta" />
      <ProfileForm name={user.name} email={user.email} role={user.role} />
      <PasswordForm />
      <SessionsCard sessions={sessions} />
    </PageContainer>
  );
}
