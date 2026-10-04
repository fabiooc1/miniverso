"use client";

import type { ComponentProps } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useIsEditing } from "../editor/editor-context";

/**
 * Botão cujo texto é editável. No editor vira um `<span>` com o mesmo visual,
 * porque texto editável dentro de `<button>` dispara cliques e envios.
 */
export function EditableButton({ variant, size, className, children, ...props }: ComponentProps<typeof Button>) {
  const isEditing = useIsEditing();

  if (isEditing) {
    return <span className={buttonVariants({ variant, size, className })}>{children}</span>;
  }

  return (
    <Button variant={variant} size={size} className={className} {...props}>
      {children}
    </Button>
  );
}
