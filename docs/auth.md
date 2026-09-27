# Autenticação e autorização

O Better Auth usa e-mail/senha e Prisma. O cadastro público está desabilitado.

| Operação | admin | superadmin |
| --- | --- | --- |
| Gerenciar conteúdo da landing page e blog | Sim | Sim |
| Atualizar o próprio nome/imagem e senha | Sim | Sim |
| Consultar/revogar as próprias sessões | Sim | Sim |
| Criar, listar, editar, bloquear e excluir outros usuários | Não | Sim |
| Alterar perfis de acesso e senhas de outros usuários | Não | Sim |
| Gerenciar sessões de outros usuários | Não | Sim |
| Entrar como outro usuário (impersonação) | Não | Não |

`src/lib/auth-permissions.ts` define permissões do plugin de gestão de usuários.
O nome `admin` do sistema não concede as permissões administrativas padrão do
plugin: ele usa `userAc`, que não autoriza operações sobre outros usuários.
`superadmin` é declarado explicitamente em `roles` e `adminRoles`.

Para a própria conta, use as operações nativas `updateUser`, `changePassword`,
`listSessions` e `revokeSession`: elas identificam o usuário pela sessão.
O perfil `role` não pode ser alterado por `updateUser`; sua alteração usa
`setRole`, restrito ao superadmin. Troca de e-mail e exclusão da própria conta
não foram habilitadas nesta configuração.

Em chamadas server-side originadas do painel, passe os headers da requisição
para as APIs do Better Auth, preservando a sessão do solicitante. Não exponha
uma chamada a `createUser` sem headers em uma Server Action: a API server-side
pode ser utilizada sem sessão para provisionamento confiável.

As futuras rotas de conteúdo devem aceitar sessões com `role` igual a `admin`
ou `superadmin`. Operações próprias de gestão de outros usuários devem exigir
`superadmin` no servidor. O plugin não protege automaticamente APIs de conteúdo
ou consultas Prisma criadas pela aplicação.

## Banco e primeiro acesso

A migration `20260927203000_admin_roles` adiciona os campos do plugin. Contas
existentes recebem `admin`; nenhuma conta é promovida automaticamente. Aplique
as migrations no banco escolhido com `pnpm db:deploy` e gere o cliente com
`pnpm db:generate`.

Configure `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` no ambiente antes de servir
a autenticação. O endpoint Next.js de autenticação e a interface de login ainda
precisam ser integrados. O primeiro superadmin deve ser provisionado por um
procedimento local confiável, com e-mail e senha definidos pelo responsável;
esta configuração não cria contas nem credenciais padrão.

Validação das permissões: `node --test src/lib/auth-permissions.test.mjs`.

Referência: https://www.better-auth.com/docs/plugins/admin
