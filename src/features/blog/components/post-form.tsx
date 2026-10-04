"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/features/admin/components/page-header";
import { discardUploads } from "@/features/uploads/actions";
import { formatDateTime } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { savePost } from "../actions";
import { EMPTY_DOCUMENT, type RichTextNode } from "../lib/rich-text";
import type { PostForEdit } from "../queries";
import { CategoryPicker, type CategoryOption } from "./category-picker";
import { CoverImageField } from "./cover-image-field";
import { RichTextEditor } from "./rich-text-editor";

type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageKey: string;
  coverImageAlt: string;
  categoryIds: number[];
  content: RichTextNode;
};

type PostFormProps = {
  post?: PostForEdit;
  categories: CategoryOption[];
};

function initialValues(post?: PostForEdit): PostFormValues {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    coverImageKey: post?.coverImageKey ?? "",
    coverImageAlt: post?.coverImageAlt ?? "",
    categoryIds: post?.categoryIds ?? [],
    content: post?.content ?? EMPTY_DOCUMENT,
  };
}

/** Formulário de post no estilo de um editor de blog: conteúdo à esquerda, ajustes à direita. */
export function PostForm({ post, categories: initialCategories }: PostFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(post));
  const [categories, setCategories] = useState(initialCategories);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Enquanto o slug não for editado à mão, ele acompanha o título.
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);
  const [isSaving, startSaving] = useTransition();

  const isEditing = Boolean(post);

  function update<K extends keyof PostFormValues>(field: K, value: PostFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[field] ? Object.fromEntries(Object.entries(current).filter(([key]) => key !== field)) : current,
    );
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugEdited) update("slug", slugify(title));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startSaving(async () => {
      const result = await savePost(post?.id ?? null, values);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      // Remove imagens enviadas nesta edição que não ficaram como capa.
      const unused = uploadedKeys.filter((key) => key !== values.coverImageKey);
      if (unused.length > 0) void discardUploads(unused);
      setUploadedKeys([]);

      toast.success(result.message);
      if (!isEditing && result.data) router.push(`/admin/blog/${result.data.id}`);
      else router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Conteúdo editorial"
        title={isEditing ? "Editar post" : "Novo post"}
        description={
          post ? `Publicado em ${formatDateTime(post.createdAt)} · atualizado em ${formatDateTime(post.updatedAt)}` : undefined
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/blog">
                <ArrowLeftIcon data-icon="inline-start" />
                Voltar
              </Link>
            </Button>
            <Button type="submit" variant="highlight" disabled={isSaving}>
              {isSaving && <Spinner data-icon="inline-start" />}
              {isEditing ? "Atualizar post" : "Publicar post"}
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-4">
          <Field data-invalid={Boolean(errors.title)}>
            <FieldLabel htmlFor="title" className="sr-only">
              Título
            </FieldLabel>
            <Textarea
              id="title"
              value={values.title}
              maxLength={160}
              rows={1}
              placeholder="Título do post"
              aria-invalid={Boolean(errors.title)}
              className="min-h-0 resize-none border-none bg-transparent px-0 text-3xl font-extrabold tracking-tight shadow-none focus-visible:ring-0 md:text-4xl"
              onChange={(event) => handleTitleChange(event.target.value.replace(/\n/g, " "))}
            />
            <FieldError>{errors.title}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.content)}>
            <FieldLabel htmlFor="content" className="sr-only">
              Conteúdo
            </FieldLabel>
            <RichTextEditor
              id="content"
              value={values.content}
              invalid={Boolean(errors.content)}
              onChange={(content) => update("content", content)}
            />
            <FieldError>{errors.content}</FieldError>
          </Field>
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Escolha pelo menos uma.</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPicker
                categories={categories}
                selectedIds={values.categoryIds}
                error={errors.categoryIds}
                onSelectedChange={(ids) => update("categoryIds", ids)}
                onCategoryCreated={(category) =>
                  setCategories((current) =>
                    [...current, category].toSorted((a, b) => a.name.localeCompare(b.name, "pt-BR")),
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagem de capa</CardTitle>
            </CardHeader>
            <CardContent>
              <CoverImageField
                imageKey={values.coverImageKey}
                alt={values.coverImageAlt}
                errors={{ image: errors.coverImageKey, alt: errors.coverImageAlt }}
                onImageChange={(key) => update("coverImageKey", key)}
                onAltChange={(alt) => update("coverImageAlt", alt)}
                onUploaded={(key) => setUploadedKeys((current) => [...current, key])}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo e URL</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Field data-invalid={Boolean(errors.excerpt)}>
                <FieldLabel htmlFor="excerpt">Resumo</FieldLabel>
                <Textarea
                  id="excerpt"
                  value={values.excerpt}
                  maxLength={300}
                  aria-invalid={Boolean(errors.excerpt)}
                  onChange={(event) => update("excerpt", event.target.value)}
                />
                {errors.excerpt ? (
                  <FieldError>{errors.excerpt}</FieldError>
                ) : (
                  <FieldDescription>Aparece na listagem do blog e nas redes sociais.</FieldDescription>
                )}
              </Field>
              <Field data-invalid={Boolean(errors.slug)}>
                <FieldLabel htmlFor="slug">URL</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>/blog/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="slug"
                    value={values.slug}
                    maxLength={80}
                    aria-invalid={Boolean(errors.slug)}
                    onChange={(event) => {
                      setSlugEdited(true);
                      update("slug", event.target.value.toLowerCase());
                    }}
                    onBlur={() => update("slug", slugify(values.slug))}
                  />
                </InputGroup>
                <FieldError>{errors.slug}</FieldError>
              </Field>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
