# Conteúdo editável da landing page

Status: implementado. Diferenças em relação à especificação original estão
marcadas como "Implementação".

## Princípio

O banco guarda apenas **conteúdo**: textos simples e referências de imagens.
Toda a apresentação (tipografia, negrito, tamanhos, cores, layout) é
responsabilidade do frontend e não é editável pelo admin.

- Textos são `string` sem formatação. Não há HTML, Markdown nem rich text.
- Imagens são `{ key, alt }`, em que `key` é a chave do serviço de arquivos.
- Seções podem ter listas desses itens (por exemplo, cards).
- Cada seção tem estrutura própria. Uma seção pode ter três textos e uma
  imagem; outra, um título e uma lista de cards.

## Divisão de responsabilidades

| Camada | Responsável por |
| --- | --- |
| Código (versionado) | Lista de seções, estrutura de cada uma (schema Zod), valores padrão, componentes e estilos |
| Banco (`Section`) | Conteúdo atual de cada seção e sua ordem |

Arquivos `.json` no repositório não são usados para conteúdo: o sistema de
arquivos da Vercel não é gravável e edições concorrentes se sobrescreveriam.

## Modelo de dados

```prisma
model Section {
  key       String   @id   // identificador fixo: "hero", "services"...
  position  Int            // ordem na landing page
  content   Json           // validado pelo schema Zod da seção
  updatedAt DateTime @updatedAt
  updatedBy String?        // id do último usuário que editou

  @@index([position])
}
```

- Implementação: a tabela também tem `id`, `visible` (ocultar seção) e
  `position` único; a reordenação move as posições para valores negativos
  antes de regravá-las, dentro da mesma transação.
- Há uma linha por seção, criada pelo seed com os valores padrão. Criar ou
  excluir seções está fora do escopo.
- Reordenar atualiza `position` de todas as seções numa `$transaction`.
- O PostgreSQL não valida a estrutura de `content`; o Zod é a única garantia.

## Schemas por seção

Cada seção tem um schema Zod, a fonte única da sua estrutura:

```ts
// src/features/sections/schemas/hero.ts
export const heroSchema = z.object({
  title: z.string().min(1).max(120),
  subtitle: z.string().max(300),
  ctaLabel: z.string().max(40),
  image: imageSchema,
});
export type HeroContent = z.infer<typeof heroSchema>;

// src/features/sections/schemas/shared.ts
export const imageSchema = z.object({
  key: z.string().min(1),
  alt: z.string().min(1).max(200),
});
```

O registry liga cada `key` à sua definição:

```ts
// src/features/sections/registry.ts
export const sections = {
  hero: { schema: heroSchema, defaults: heroDefaults, label: "Hero", Component: HeroSection },
  // ...
} satisfies Record<string, SectionDefinition>;
```

O mesmo schema é usado para:

1. Tipar o conteúdo (`z.infer`).
2. Validar no servidor antes de gravar (obrigatório).
3. Validar na leitura: conteúdo inválido ou de formato antigo cai para os
   `defaults` da seção, sem quebrar a página, e o erro é registrado no log.
4. Popular o seed.

Limites de tamanho (`max`) devem refletir o espaço disponível no design.

### Alteração de schema

Ao mudar a estrutura de uma seção que já tem conteúdo salvo:

- Campo novo: use `.default(...)` no schema.
- Campo renomeado ou com tipo alterado: escreva uma migração de dados que
  transforme o `content` existente, junto da migration do Prisma.

## Imagens

- O JSON guarda a `key` do arquivo, nunca a URL. A URL é obtida pelo serviço
  de arquivos (`src/lib/storage`), o que permite trocar o provedor sem migrar
  o conteúdo.
- O upload ocorre quando o admin escolhe o arquivo; a `key` retornada entra no
  rascunho do editor.
- Ao salvar, a Server Action compara o conteúdo antigo com o novo e remove as
  imagens que deixaram de ser referenciadas.
- Ao descartar alterações, os uploads ainda não salvos são removidos.
- `alt` é obrigatório.

## Exibição pública

```tsx
// src/app/page.tsx (Server Component)
const sections = await getLandingSections();
return sections.map(({ key, content }) => {
  const { Component } = registry[key];
  return <Component key={key} content={content} />;
});
```

- `getLandingSections` usa `'use cache'` e `cacheTag("landing")`. Requer
  `cacheComponents: true` em `next.config.ts`.
- Seções sem entrada no registry são ignoradas.

## Edição visual (`/admin/landing`)

O admin edita numa cópia da própria landing page, no estilo de um editor
visual. **Os mesmos componentes de seção** são usados na página pública e no
editor; muda apenas o comportamento dos pontos editáveis.

```tsx
export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className="...">
      <EditableText path="title" value={content.title} as="h1" className="text-5xl font-bold" />
      <EditableText path="subtitle" value={content.subtitle} as="p" className="..." />
      <EditableImage path="image" value={content.image} className="..." />
    </section>
  );
}
```

### Componentes editáveis

Ficam em `src/features/sections/editable/`. São client components que leem o
`EditorContext`; **fora do `EditorProvider` renderizam o elemento comum**, sem
qualquer comportamento de edição.

| Componente | Visitante | Modo edição |
| --- | --- | --- |
| `EditableText` | Elemento indicado em `as` | `contentEditable="plaintext-only"`, contorno no hover, limite de caracteres do schema, colagem sem formatação |
| `EditableImage` | `next/image` | Camada "Trocar imagem" que abre um `Dialog` com upload, prévia e campo `alt` |
| `EditableList` | Renderiza os itens | Adicionar, remover e mover itens |
| `EditableLink` | `<a>` | Texto editável na página; `href` editado num `Popover` |

O estilo vem sempre do `className` definido no componente da seção; o admin
não tem como alterá-lo.

### Fluxo do editor

```
┌──────────────────────────────────────────────┐
│ Barra fixa: [Descartar] [Salvar] ●           │  ● = alterações não salvas
├──────────────────────────────────────────────┤
│ ┌ Hero ───────────────────── [↑][↓] ┐        │  controles no hover
│ │  (página idêntica, editável)      │        │
│ └───────────────────────────────────┘        │
└──────────────────────────────────────────────┘
```

- `EditorProvider` mantém um rascunho de todas as seções no cliente; editar
  altera apenas esse estado.
- **Salvar** chama uma Server Action que:
  1. verifica no servidor se a sessão é `admin` ou `superadmin`;
  2. valida cada seção alterada com seu schema;
  3. grava conteúdo e ordem numa `$transaction`, preenchendo `updatedBy`;
  4. remove imagens não referenciadas;
  5. chama `updateTag("landing")`.
- Erros de validação retornam por campo (`path`) e são destacados no editor.
- **Reordenar** usa os botões ↑/↓ de cada seção. Arrastar fica como melhoria
  futura.
- `beforeunload` avisa quando há alterações não salvas.

## Estrutura de pastas

```
src/features/sections/
  registry.ts             key → schema, defaults, label, Component
  schemas/                um schema por seção + shared.ts
  components/             componentes de seção (públicos e editáveis)
  editable/               EditableText, EditableImage, EditableList, EditableLink
  editor/                 EditorProvider, barra de ações, controles de seção
  actions.ts              saveSections (com checagem de role)
  queries.ts              getLandingSections (cacheada)
src/lib/storage/          interface FileStorage + provedores Supabase e local (uploads/)
```

## Dependências a adicionar

- `zod`
- `react-hook-form` e `@hookform/resolvers` somente se algum formulário
  auxiliar (por exemplo, o `Dialog` de imagem) precisar.

## Seções implementadas

Mapeadas a partir das telas em `references/`: `hero`, `brands`, `services`,
`experience`, `process`, `projects`, `testimonial`, `contact` e `footer`
(fixa: sempre visível e no fim). O cabeçalho do site não é editável.

Notas de implementação:

- Imagem com `key` vazia é "sem imagem": a seção mostra um placeholder com o
  gradiente da marca. `alt` é obrigatório quando há imagem.
- Hero, "Onde atuamos" e os cards de Projetos usam o tipo **mídia**
  (`mediaSchema`): `{ type: "image", image: { key, alt } }` ou
  `{ type: "video", video: { provider, videoId, hash?, title, thumbnailUrl } }`.
  No editor, `EditableMedia` abre o diálogo "Trocar mídia" com as abas Imagem
  (upload) e Vídeo (link). A migração `20261004200000_landing_media_fields`
  converteu o formato antigo (`image` → `media`, `imageCaption` →
  `mediaCaption`).
- Listas usam `EditableListItem` + `EditableListAdd` (em vez de render props,
  que não podem ser passadas de Server Components); limites de quantidade e de
  caracteres são lidos do próprio schema Zod.
- `EditableLinkArea` cria áreas clicáveis (cards de projeto) e
  `EditableButton` permite editar o texto de botões.
- Seções sem linha no banco aparecem com os valores padrão e são gravadas no
  primeiro salvamento.

## Pendências

- Arrastar para reordenar (hoje: botões ↑/↓ na seção e no painel "Seções").
