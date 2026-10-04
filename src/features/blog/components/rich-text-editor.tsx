"use client";

import { EditorContent, ReactNodeViewRenderer, useEditor, useEditorState, type Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { VideoLinkForm } from "@/features/video/components/video-link-form";
import type { VideoContent } from "@/features/video/video";
import { createRichTextExtensions, type RichTextNode } from "../lib/rich-text";
import { VideoNodeView } from "./video-node-view";

type RichTextEditorProps = {
  id?: string;
  value: RichTextNode;
  onChange: (value: RichTextNode) => void;
  invalid?: boolean;
};

export function RichTextEditor({ id, value, onChange, invalid }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: createRichTextExtensions({
      placeholder: "Comece a escrever o post…",
      videoNodeView: ReactNodeViewRenderer(VideoNodeView),
    }),
    content: value,
    // Evita divergência de hidratação: o editor só existe no navegador.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id: id ?? "",
        class: "rich-text min-h-96 px-6 py-5 outline-none",
        "aria-label": "Conteúdo do post",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    // O ProseMirror cria `attrs` com `Object.create(null)`, que não chega íntegro
    // numa Server Action; o JSON.parse devolve objetos comuns.
    onUpdate: ({ editor }) => onChange(JSON.parse(JSON.stringify(editor.getJSON())) as RichTextNode),
  });

  return (
    <div
      data-invalid={invalid}
      className="overflow-hidden rounded-xl border bg-card focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 data-[invalid=true]:border-destructive"
    >
      {editor ? <Toolbar editor={editor} /> : <div className="h-12 border-b" />}
      <EditorContent editor={editor} />
    </div>
  );
}

type ToolbarToggleProps = {
  label: string;
  icon: LucideIcon;
  pressed: boolean;
  onPressedChange: () => void;
};

function ToolbarToggle({ label, icon: Icon, pressed, onPressedChange }: ToolbarToggleProps) {
  return (
    <Toggle size="sm" aria-label={label} title={label} pressed={pressed} onPressedChange={onPressedChange}>
      <Icon />
    </Toggle>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      link: editor.isActive("link"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div role="toolbar" aria-label="Formatação" className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2">
      <ToolbarToggle label="Subtítulo" icon={Heading2Icon} pressed={state.h2} onPressedChange={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolbarToggle label="Subtítulo menor" icon={Heading3Icon} pressed={state.h3} onPressedChange={() => chain().toggleHeading({ level: 3 }).run()} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarToggle label="Negrito" icon={BoldIcon} pressed={state.bold} onPressedChange={() => chain().toggleBold().run()} />
      <ToolbarToggle label="Itálico" icon={ItalicIcon} pressed={state.italic} onPressedChange={() => chain().toggleItalic().run()} />
      <ToolbarToggle label="Sublinhado" icon={UnderlineIcon} pressed={state.underline} onPressedChange={() => chain().toggleUnderline().run()} />
      <ToolbarToggle label="Tachado" icon={StrikethroughIcon} pressed={state.strike} onPressedChange={() => chain().toggleStrike().run()} />
      <LinkControl editor={editor} active={state.link} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarToggle label="Lista" icon={ListIcon} pressed={state.bulletList} onPressedChange={() => chain().toggleBulletList().run()} />
      <ToolbarToggle label="Lista numerada" icon={ListOrderedIcon} pressed={state.orderedList} onPressedChange={() => chain().toggleOrderedList().run()} />
      <ToolbarToggle label="Destaque" icon={QuoteIcon} pressed={state.blockquote} onPressedChange={() => chain().toggleBlockquote().run()} />
      <VideoControl editor={editor} />
      <div className="ml-auto flex gap-1">
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Desfazer" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
          <Undo2Icon />
        </Button>
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Refazer" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
          <Redo2Icon />
        </Button>
      </div>
    </div>
  );
}

function LinkControl({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState("");
  const inputId = useId();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setHref((editor.getAttributes("link").href as string | undefined) ?? "");
    setOpen(nextOpen);
  }

  function apply() {
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href.trim()) chain.setLink({ href: href.trim() }).run();
    else chain.unsetLink().run();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Toggle size="sm" aria-label="Link" title="Link" pressed={active}>
          <LinkIcon />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            apply();
          }}
        >
          <Field>
            <FieldLabel htmlFor={inputId}>Endereço do link</FieldLabel>
            <Input id={inputId} value={href} placeholder="https://" onChange={(event) => setHref(event.target.value)} />
            <FieldDescription>Deixe vazio para remover o link.</FieldDescription>
          </Field>
          <Button type="submit" size="sm" className="self-end">
            Aplicar
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function VideoControl({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState<VideoContent | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setVideo(null);
    setOpen(nextOpen);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Inserir vídeo" title="Inserir vídeo">
          <VideoIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="flex flex-col gap-4">
          <VideoLinkForm value={video} onChange={setVideo} />
          <Button
            type="button"
            size="sm"
            className="self-end"
            disabled={!video?.title.trim()}
            onClick={() => {
              if (!video) return;
              editor.chain().focus().setVideo({ ...video, title: video.title.trim() }).run();
              setOpen(false);
            }}
          >
            Inserir vídeo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
