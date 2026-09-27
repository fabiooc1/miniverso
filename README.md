# Miniverso

Next.js com Prisma ORM 7 e PostgreSQL no Supabase.

## Banco de dados

1. Instale as dependências com `pnpm install`. O Prisma Client é gerado automaticamente.
2. Copie `.env.example` para `.env` e preencha as URLs PostgreSQL fornecidas pelo painel **Connect** do Supabase. As senhas na URL devem estar codificadas como URL.
3. Use `DATABASE_URL` para a aplicação (pooler de transações, porta 6543) e `DIRECT_URL` para migrations (conexão direta ou pooler de sessão, porta 5432). Ambas devem apontar para o mesmo banco. A conexão direta exige conectividade IPv6 quando não há suporte IPv4 no projeto Supabase; nesse caso, use o pooler de sessão.

O `.env` é carregado pelo Next.js e pelo Prisma CLI e não é versionado. Não use o prefixo `NEXT_PUBLIC_` para conexões do banco. A CLI usa `DIRECT_URL`, com fallback para `DATABASE_URL` quando a primeira não está preenchida.

O schema inicial está em `prisma/schema.prisma`, ainda sem entidades: a modelagem do domínio será definida separadamente. Nenhuma migration ou seed foi criado nesta etapa.

| Comando | Uso |
| --- | --- |
| `pnpm db:generate` | Gerar o cliente após alterações no schema |
| `pnpm db:validate` | Validar o schema |
| `pnpm db:migrate --name nome_da_alteracao` | Criar e aplicar migration em um banco de desenvolvimento |
| `pnpm db:deploy` | Aplicar migrations existentes em produção |
| `pnpm db:studio` | Abrir o Prisma Studio |

Após definir os modelos, execute a migration no banco de desenvolvimento e gere o cliente novamente. `migrate dev` pode precisar de um banco auxiliar (shadow database); nunca aponte esse banco auxiliar para o banco principal ou de produção.

Importe `prisma` de `@/src/lib/prisma` em Server Components, Server Actions ou Route Handlers com runtime Node.js. O módulo é exclusivo do servidor e reutiliza a instância em desenvolvimento. O alias atual `@/` aponta para a raiz do projeto. A geração do cliente não exige conexão com o banco, mas o uso desse módulo exige `DATABASE_URL`.

As skills oficiais estão em `.agents/skills`; para atualizá-las, execute `pnpm dlx skills update`. A configuração segue o [guia oficial do Prisma 7 para Next.js](https://www.prisma.io/docs/guides/v7/frameworks/nextjs).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
