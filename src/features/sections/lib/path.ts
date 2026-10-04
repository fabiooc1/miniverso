/** Caminhos de campo no formato "items.0.title". */
export type FieldPath = string;

export function toSegments(path: FieldPath): (string | number)[] {
  return path
    .split(".")
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

export function getIn(value: unknown, path: FieldPath): unknown {
  return toSegments(path).reduce<unknown>(
    (current, segment) =>
      current == null ? undefined : (current as Record<string | number, unknown>)[segment],
    value,
  );
}

/** Retorna uma cópia de `target` com `value` no caminho, sem mutar o original. */
export function setIn<T>(target: T, path: FieldPath, value: unknown): T {
  const [head, ...rest] = toSegments(path);
  if (head === undefined) return value as T;

  const restPath = rest.join(".");
  const current = (target as Record<string | number, unknown>)?.[head];
  const next = rest.length ? setIn(current, restPath, value) : value;

  if (Array.isArray(target)) {
    const copy = [...target];
    copy[head as number] = next;
    return copy as T;
  }

  return { ...(target as object), [head]: next } as T;
}
