import { storage } from "@/lib/storage";

export async function GET(_request: Request, ctx: RouteContext<"/uploads/[...key]">) {
  const { key } = await ctx.params;
  const file = await storage.read(key.join("/"));

  if (!file) {
    return new Response("Arquivo não encontrado", { status: 404 });
  }

  return new Response(file.body, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      // As chaves são únicas (uuid), então o conteúdo nunca muda.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
