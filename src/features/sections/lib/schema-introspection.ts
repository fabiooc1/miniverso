import { z } from "zod";
import { toSegments, type FieldPath } from "./path";

/** Desembrulha optional/default/pipe para chegar ao schema "de verdade". */
function unwrap(schema: z.ZodType): z.ZodType {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrap(schema.unwrap() as z.ZodType);
  }
  if (schema instanceof z.ZodDefault) {
    return unwrap(schema.unwrap() as z.ZodType);
  }
  if (schema instanceof z.ZodPipe) {
    return unwrap(schema.in as z.ZodType);
  }
  if (schema instanceof z.ZodUnion) {
    return unwrap(schema.options[0] as z.ZodType);
  }
  return schema;
}

/** Encontra o schema de um campo a partir do schema da seção. */
export function getSchemaAt(schema: z.ZodType, path: FieldPath): z.ZodType | undefined {
  let current: z.ZodType | undefined = schema;

  for (const segment of toSegments(path)) {
    if (!current) return undefined;
    const resolved = unwrap(current);

    if (resolved instanceof z.ZodObject && typeof segment === "string") {
      current = resolved.shape[segment] as z.ZodType | undefined;
    } else if (resolved instanceof z.ZodArray) {
      current = resolved.element as z.ZodType;
    } else {
      return undefined;
    }
  }

  return current ? unwrap(current) : undefined;
}

/** Limite de caracteres de um campo de texto, lido do próprio schema. */
export function getMaxLength(schema: z.ZodType, path: FieldPath): number | undefined {
  const field = getSchemaAt(schema, path);
  return field instanceof z.ZodString ? (field.maxLength ?? undefined) : undefined;
}

/** Limites de quantidade de itens de uma lista. */
export function getArrayBounds(schema: z.ZodType, path: FieldPath) {
  const field = getSchemaAt(schema, path);
  if (!(field instanceof z.ZodArray)) return { min: 0, max: Infinity };

  let min = 0;
  let max = Infinity;
  for (const check of field._zod.def.checks ?? []) {
    const def = check._zod.def as { check: string; minimum?: number; maximum?: number };
    if (def.check === "min_length" && def.minimum !== undefined) min = def.minimum;
    if (def.check === "max_length" && def.maximum !== undefined) max = def.maximum;
  }
  return { min, max };
}
