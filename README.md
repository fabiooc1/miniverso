# Miniverso

Next.js com Prisma ORM 7 e PostgreSQL no Supabase.

## Banco de dados

1. Instale as dependências com `pnpm install`. O Prisma Client é gerado automaticamente.
2. Copie `.env.example` para `.env` e preencha as URLs PostgreSQL fornecidas pelo painel **Connect** do Supabase. As senhas na URL devem estar codificadas como URL.
3. Use `DATABASE_URL` para a aplicação (pooler de transações, porta 6543) e `DIRECT_URL` para migrations (conexão direta ou pooler de sessão, porta 5432). Ambas devem apontar para o mesmo banco. A conexão direta exige conectividade IPv6 quando não há suporte IPv4 no projeto Supabase; nesse caso, use o pooler de sessão.

O `.env` é carregado pelo Next.js e pelo Prisma CLI e não é versionado. Não use o prefixo `NEXT_PUBLIC_` para conexões do banco. A CLI usa `DIRECT_URL`, com fallback para `DATABASE_URL` quando a primeira não está preenchida.

O schema está em `prisma/schema.prisma`. O seed (`pnpm db:seed`) é idempotente: cria as seções da landing com os valores padrão e, se `SUPERADMIN_NAME`, `SUPERADMIN_EMAIL` e `SUPERADMIN_PASSWORD` estiverem preenchidas no `.env`, o superadmin inicial.

| Comando | Uso |
| --- | --- |
| `pnpm db:generate` | Gerar o cliente após alterações no schema |
| `pnpm db:validate` | Validar o schema |
| `pnpm db:migrate --name nome_da_alteracao` | Criar e aplicar migration em um banco de desenvolvimento |
| `pnpm db:deploy` | Aplicar migrations existentes em produção |
| `pnpm db:seed` | Criar seções padrão da landing e o superadmin inicial |
| `pnpm db:studio` | Abrir o Prisma Studio |

Após definir os modelos, execute a migration no banco de desenvolvimento e gere o cliente novamente. `migrate dev` pode precisar de um banco auxiliar (shadow database); nunca aponte esse banco auxiliar para o banco principal ou de produção.

Importe `prisma` de `@/lib/prisma` em Server Components, Server Actions ou Route Handlers com runtime Node.js. O módulo reutiliza a instância em desenvolvimento. O alias `@/` aponta para `src/`. A geração do cliente não exige conexão com o banco, mas o uso desse módulo exige `DATABASE_URL`.

As skills oficiais estão em `.agents/skills`; para atualizá-las, execute `pnpm dlx skills update`. A configuração segue o [guia oficial do Prisma 7 para Next.js](https://www.prisma.io/docs/guides/v7/frameworks/nextjs).

## Primeiro acesso

1. Preencha o `.env` (banco, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e as variáveis `SUPERADMIN_*`).
2. `pnpm db:deploy` e `pnpm db:seed`.
3. `pnpm dev` e acesse `http://localhost:3000/login`.

## Armazenamento de imagens

As imagens passam pela interface `FileStorage` (`src/lib/storage`). O provedor é escolhido por `STORAGE_PROVIDER`:

| Provedor | Uso | Variáveis |
| --- | --- | --- |
| `supabase` (padrão do projeto) | Bucket público no Supabase Storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` |
| `local` | Desenvolvimento, pasta `uploads/` servida em `/uploads` | `UPLOADS_DIR` (opcional) |

- O `pnpm db:seed` cria o bucket público (limite de 5 MB e apenas tipos de imagem) quando o provedor é `supabase`.
- A URL pública das imagens é derivada do provedor no `next.config.ts`; `NEXT_PUBLIC_FILES_BASE_URL` só é necessária para sobrescrevê-la (ex.: uma CDN).
- A `SUPABASE_SERVICE_ROLE_KEY` é secreta e usada só no servidor.
- Trocar de provedor: implemente `FileStorage`, registre-o em `src/lib/storage/index.ts` e copie os arquivos mantendo as mesmas chaves. O banco não precisa de migração, porque guarda só as chaves.

## Estrutura

```
src/
  app/                    rotas (site público, /login, /admin/*, /uploads/*)
  components/ui/          componentes shadcn/ui (tema em src/app/globals.css)
  components/brand/       logo
  features/
    admin/                shell do painel (sidebar, cabeçalhos de página)
    auth/                 sessão (DAL), login/logout, perfis de acesso
    sections/             landing editável (ver docs/landing-content.md)
    blog/                 posts, categorias e editor rich text (Tiptap)
    users/                gestão de colaboradores (somente superadmin)
    account/              "Minha conta": perfil, senha e sessões
    uploads/              upload de imagens e limpeza de arquivos órfãos
  lib/                    prisma, auth, storage, utilitários
```

Convenções:

- Toda página e Server Action do painel chama `requireAdmin()` ou `requireSuperadmin()` (`features/auth/session.ts`). O `proxy.ts` só faz uma checagem otimista do cookie.
- Server Actions retornam `ActionResult` (`lib/action-result.ts`), com erros por campo no formato `"caminho.do.campo"`.
- Arquivos são acessados apenas pela interface `FileStorage` (`lib/storage`). O conteúdo guarda a chave do arquivo, nunca a URL.
- Cores e estilos vêm dos tokens do design system em `globals.css` (`primary` violeta, `highlight` lima, seções escuras com a classe `dark`).

## Design system

| Token | Valor | Uso |
| --- | --- | --- |
| `--brand-night` | `#090A14` | fundo escuro, sidebar do painel |
| `--brand-night-2` | `#151625` | superfícies sobre o fundo escuro |
| `--primary` | `#6C4CFF` | cor principal, botões, rótulos |
| `--highlight` | `#C8FF3D` | CTAs (`<Button variant="highlight">`) |
| `--background` | `#F4F3FF` | fundo claro |

Tipografia Inter; títulos em peso extra-bold; botões em formato pílula; rótulos acima dos títulos com a classe `eyebrow`.

## Pendências conhecidas

- Páginas públicas do blog (`/blog`, `/blog/[slug]`) e envio do formulário de contato.
