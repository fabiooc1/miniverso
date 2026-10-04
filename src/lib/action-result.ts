/**
 * Formato padrão de retorno das Server Actions usadas com `useActionState`.
 * `fieldErrors` usa o caminho do campo (ex.: "title" ou "items.0.title").
 */
export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export function actionError(
  message: string,
  fieldErrors?: Record<string, string>,
): ActionResult<never> {
  return { ok: false, message, fieldErrors };
}

/** Converte os issues de um ZodError em `{ "caminho.do.campo": "mensagem" }`. */
export function zodFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const path = issue.path.map(String).join(".");
    fieldErrors[path] ??= issue.message;
  }

  return fieldErrors;
}
