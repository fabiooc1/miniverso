import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { PageContainer } from "@/features/admin/components/page-container";

export default function AdminNotFound() {
  return (
    <PageContainer>
      <Empty className="border bg-card">
        <EmptyHeader>
          <EmptyTitle>Página não encontrada</EmptyTitle>
          <EmptyDescription>Ela não existe ou você não tem permissão para acessá-la.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/admin">Voltar ao painel</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </PageContainer>
  );
}
