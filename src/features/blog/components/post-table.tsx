import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImagePreview } from "@/features/uploads/components/image-preview";
import { formatDate } from "@/lib/format";
import type { AdminPostListItem } from "../queries";
import { DeletePostButton } from "./delete-post-button";

export function PostTable({ posts }: { posts: AdminPostListItem[] }) {
  return (
    <Table className="border-separate border-spacing-y-2">
      <TableHeader>
        <TableRow className="border-none hover:bg-transparent">
          <TableHead className="pl-24 text-xs uppercase">Título</TableHead>
          <TableHead className="text-xs uppercase">Categorias</TableHead>
          <TableHead className="text-xs uppercase">Data</TableHead>
          <TableHead className="text-right text-xs uppercase">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id} className="bg-card shadow-xs hover:bg-card [&>td]:border-y [&>td:first-child]:rounded-l-xl [&>td:first-child]:border-l [&>td:last-child]:rounded-r-xl [&>td:last-child]:border-r">
            <TableCell className="py-3">
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                  <ImagePreview imageKey={post.coverImageKey} alt={post.coverImageAlt} sizes="56px" />
                </div>
                <Link href={`/admin/blog/${post.id}`} className="line-clamp-2 max-w-md font-bold whitespace-normal hover:text-primary">
                  {post.title}
                </Link>
              </div>
            </TableCell>
            <TableCell className="max-w-48 font-semibold whitespace-normal text-primary">
              {post.categories.map((category) => category.name).join(", ")}
            </TableCell>
            <TableCell className="text-muted-foreground">
              <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
              {post.author && <p className="text-xs">por {post.author.name}</p>}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button size="sm" asChild>
                  <Link href={`/admin/blog/${post.id}`}>Editar</Link>
                </Button>
                <DeletePostButton postId={post.id} title={post.title} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
