Você vai utilizar como base o projeto https://www.figma.com/design/8BJsuYdhzwOnbr2p9C5CQJ/PAW---Miniverso?node-id=0-1&t=gJuOdCF1YZwcIzZo-1

1. Contexto do sistema:
O sistema como um todo consiste na landing page da empresa miniverso sendo ela constituida por contéudos personalizados em que o administrador do sistema consiga editar, como as imagens e textos juntamente com um blog que vai ter no site. Para deixar claro o usuário comum apenas visualiza o contéudo da landing page enquanto caso ele opte por entrar como administrador, ele consiga gerenciar blogs e o contéudo dela.

2. Regras:
- Nunca faça algo com dúvida, pergunte e esclareça sua dúvida
- Sempre tente utilizar os componentes do Shadcn a medida do possível do contrário você vai criar um componente personalizado para atender ao design
- Utilize boas práticas de código, design partners e padrões comumentes utilizados pelo React e NextJS
- Você deve sempre utilizar as skills do REACT e NEXTJS para assegurar qualidade no código e tratar corretamente os conceitos que cada ferramenta precisa de forma correta

3. Decisões de arquitetura e escopo:
- O administrador pode editar os conteúdos existentes e alterar sua ordem. A criação livre de novas seções não faz parte do escopo definido.
- O painel administrativo será personalizado conforme o Figma, aproveitando componentes do shadcn/ui e adaptando cores e estilos. Não será utilizado um painel pronto de CMS.
- O banco de dados será PostgreSQL hospedado no Supabase.
- O ORM será Prisma.
- As publicações do blog serão publicadas imediatamente ao enviar, sem fluxo de rascunhos.
- Cada publicação do blog deve possuir pelo menos uma categoria e pode pertencer a várias categorias. Uma categoria pode estar associada a várias publicações.
- A autenticação utilizará Better Auth, considerando a evolução futura dos perfis de acesso e das permissões. Supabase será utilizado como provedor de PostgreSQL, não como provedor de autenticação.
- O acesso será dividido entre visitante, admin e superadmin. O visitante acessa apenas o conteúdo público da landing page e do blog, sem precisar de autenticação e sem acesso ao painel ou às operações de alteração.
- Admin e superadmin têm acesso completo à gestão de conteúdo da landing page e do blog. Apenas o superadmin pode gerenciar outros usuários e seus perfis de acesso; o admin pode gerenciar somente a própria conta, sem alterar o próprio perfil de acesso.
- O cadastro público está desabilitado. Novas contas administrativas recebem o perfil admin por padrão; superadmin é atribuído explicitamente.
- As rotas e operações administrativas devem verificar no servidor se a sessão pertence a um admin ou superadmin. Operações de gestão de outros usuários exigem superadmin; ocultar controles na interface não substitui essas verificações.
- O projeto tem fins acadêmicos e a prioridade é utilizar hospedagem gratuita. A Vercel continua como candidata para a aplicação; a topologia de hospedagem dos arquivos ainda precisa ser definida.
- O armazenamento inicial de arquivos será uma pasta `uploads/` no servidor ou no projeto, acessada por um serviço de arquivos desacoplado. O objetivo é permitir substituir o armazenamento futuramente sem alterar os consumidores do serviço.
- A decisão sobre armazenamento de arquivos em produção fica adiada para antes do deploy. Essa pendência não bloqueia o planejamento ou o desenvolvimento com o provedor local de uploads.
- Uploads locais exigem um ambiente com disco persistente e gravável. As funções da Vercel não oferecem esse armazenamento; para hospedar a aplicação nela, será necessário hospedar o armazenamento local separadamente ou substituir sua implementação.
- O conteúdo da landing page fica no banco: uma linha por seção na tabela `Section`, com o conteúdo em `jsonb` validado por um schema Zod por seção definido no código. O banco guarda apenas textos simples e imagens; toda a apresentação (tipografia, negrito, tamanhos, layout) é do frontend.
- A edição da landing page é visual: o admin edita numa cópia da própria página, que usa os mesmos componentes de seção da página pública com pontos editáveis. Especificação completa em `docs/landing-content.md`.
