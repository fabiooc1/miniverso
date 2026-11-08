# Plano de PWA

> Status: proposta, ainda não implementada. Há decisões em aberto no fim do documento.

O objetivo é cumprir o requisito de PWA da cadeira de Programação Web Avançada sem quebrar a dinâmica do Next.js: o app deve ser instalável e mostrar o último conteúdo carregado quando estiver offline, mas, com internet, o conteúdo vem sempre da rede.

## Regra central

**Com internet, a página sempre vem da rede. O cache só é usado quando a rede falha.** Cada visita online substitui a cópia salva, então o offline mostra o último conteúdo carregado. O `updateTag` continua valendo como hoje: o admin salva e a próxima visita online já recebe o conteúdo novo e atualiza a cópia.

A landing não lê sessão, então a cópia salva não guarda dados de nenhum usuário.

## Estratégias do service worker

| Requisição | Estratégia | Efeito |
| --- | --- | --- |
| Páginas públicas (`/`, e `/blog` quando existir) | Rede primeiro, cópia salva se falhar | Online sempre atualizado |
| `/_next/static/*` (JS, CSS, fontes) | Cache primeiro | Seguro, os nomes têm hash |
| `/_next/image` | Cache primeiro, com limite de itens | Seguro, as chaves têm UUID e nunca mudam de conteúdo |
| `/admin`, `/login`, `/api/*`, POST e requisições RSC | Não intercepta | Painel, sessão e Server Actions seguem como hoje |
| Página nunca visitada, estando offline | `offline.html` | Evita o erro do navegador |

Outras definições:

- `skipWaiting` e `clients.claim` para a nova versão assumir logo, e `navigationPreload` para evitar o atraso de iniciar o service worker a cada navegação.
- Se algo der errado, publicar um `sw.js` que se autodesregistra remove tudo dos clientes.
- O `sw.js` é escrito à mão. `experimental.useOffline` e Serwist não são necessários para este escopo. O `useOffline` ainda reenviaria Server Actions do painel quando a conexão voltasse, podendo gravar uma edição antiga bem depois.

## Limitações conhecidas

- **Primeira visita:** o service worker só assume o controle depois que a página já carregou, então essa carga não passaria por ele. Para o offline funcionar logo após a primeira visita, o componente de registro envia ao service worker a URL da página e a lista de assets já carregados, e ele os salva.
- **Imagens:** só ficam salvas as que chegaram a carregar, porque as demais são lazy e dependem da rolagem.
- **Vídeos:** os embeds de YouTube e Vimeo não funcionam offline, só as miniaturas que já carregaram.
- **Conexão muito lenta:** o app espera a rede em vez de cair na cópia, e é isso que garante conteúdo atualizado quando há internet.

## Etapas

1. **Instalação:** criar `src/app/manifest.ts` e os ícones (192, 512, maskable e `apple-icon`), adicionar `viewport.themeColor` e `metadata.appleWebApp` em `src/app/layout.tsx` e trocar o `favicon.ico`, que parece ainda ser o padrão do Next.
2. **Service worker:** criar `public/sw.js` e `public/offline.html` (com CSS embutido, sem depender de assets do build), registrar por um componente cliente só em produção e adicionar em `next.config.ts` os headers de `/sw.js` (`Cache-Control: no-cache` e CSP).
3. **Aviso offline:** faixa discreta na landing, "Você está offline, exibindo a última versão salva".
4. **Atualizar ao retomar:** na página pública, chamar `router.refresh()` ao voltar para o app depois de 5 minutos em segundo plano, se houver conexão. O app instalado volta da memória sem recarregar e, sem isso, poderia exibir conteúdo antigo por dias. Fica fora do `/admin` para não interferir na edição em andamento.
5. **Validação** com `pnpm build && pnpm start`:
   - Instalar o app, abrir uma vez, ficar offline, recarregar e ver a landing.
   - Voltar online, editar no admin e confirmar que a mudança aparece.
   - Testar o link "Blog" offline, que deve cair no `offline.html`.
   - Testar login, upload e a edição no painel.
   - Testar um novo deploy com o app já instalado.

## Decisões em aberto

1. **Notificações push:** a cadeira exige? Se não exigir, ficam de fora, porque são a parte mais trabalhosa (chaves VAPID, tabela de inscrições e fluxo de consentimento) e o blog público ainda não existe.
2. **Ícone:** usar arte do Figma, se houver, ou gerar a partir do SVG do `Logo` sobre o violeta `#6c4cff`.
3. **Botão "Instalar app":** recomendado um item simples, com `beforeinstallprompt` no Android e desktop e instruções no iOS, porque deixa o requisito visível na apresentação. Sem ele, a instalação fica só pelo menu do navegador.
