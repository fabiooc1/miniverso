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
- Nesta etapa, o acesso será dividido entre visitante e administrador. O visitante acessa apenas o conteúdo público da landing page e do blog, sem precisar de autenticação e sem acesso ao painel ou às operações de alteração.
- O administrador autenticado tem acesso completo a todas as funcionalidades administrativas previstas no escopo. Não haverá restrições entre administradores, matriz de permissões granulares ou perfis administrativos adicionais nesta etapa.
- As rotas e operações administrativas devem verificar no servidor se a sessão pertence a um administrador; ocultar controles na interface não substitui essa verificação.
- O projeto tem fins acadêmicos e a prioridade é utilizar hospedagem gratuita. A Vercel continua como candidata para a aplicação; a topologia de hospedagem dos arquivos ainda precisa ser definida.
- O armazenamento inicial de arquivos será uma pasta `uploads/` no servidor ou no projeto, acessada por um serviço de arquivos desacoplado. O objetivo é permitir substituir o armazenamento futuramente sem alterar os consumidores do serviço.
- A decisão sobre armazenamento de arquivos em produção fica adiada para antes do deploy. Essa pendência não bloqueia o planejamento ou o desenvolvimento com o provedor local de uploads.
- Uploads locais exigem um ambiente com disco persistente e gravável. As funções da Vercel não oferecem esse armazenamento; para hospedar a aplicação nela, será necessário hospedar o armazenamento local separadamente ou substituir sua implementação.
