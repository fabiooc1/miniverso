import type { Metadata } from "next";
import { PageContainer } from "@/features/admin/components/page-container";
import { PageHeader } from "@/features/admin/components/page-header";
import { requireSuperadmin } from "@/features/auth/session";
import { CreateUserDialog } from "@/features/users/components/create-user-dialog";
import { UsersTable } from "@/features/users/components/users-table";
import { listUsers } from "@/features/users/queries";

export const metadata: Metadata = { title: "Colaboradores" };

export default async function UsersPage() {
  const session = await requireSuperadmin();
  const users = await listUsers();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Sistema"
        title="Colaboradores"
        description="Admins gerenciam o conteúdo; superadmins também gerenciam as contas."
        actions={<CreateUserDialog />}
      />
      <UsersTable users={users} currentUserId={session.user.id} />
    </PageContainer>
  );
}
