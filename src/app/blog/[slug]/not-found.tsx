import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function BlogPostNotFound() {
  return (
    <main className="site-container flex flex-1 flex-col py-20">
      <Empty className="border bg-card">
        <EmptyHeader>
          <EmptyTitle>Artigo não encontrado</EmptyTitle>
          <EmptyDescription>Ele pode ter sido removido ou o endereço está incorreto.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/blog" className={buttonVariants({ variant: "highlight" })}>
            Ver todos os artigos
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
