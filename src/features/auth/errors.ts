import { APIError } from "better-auth/api";
import { actionError } from "@/lib/action-result";

/** Mensagens em português para os erros mais comuns do Better Auth. */
const MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Já existe uma conta com este e-mail.",
  INVALID_PASSWORD: "Senha atual incorreta.",
  PASSWORD_TOO_SHORT: "A senha é muito curta.",
  PASSWORD_TOO_LONG: "A senha é muito longa.",
  YOU_CANNOT_BAN_YOURSELF: "Você não pode bloquear a própria conta.",
  YOU_CANNOT_REMOVE_YOURSELF: "Você não pode excluir a própria conta.",
};

/** Converte um APIError em ActionResult; outros erros são relançados. */
export function authActionError(error: unknown, fallback: string) {
  if (error instanceof APIError) {
    const code = (error.body as { code?: string } | undefined)?.code;
    return actionError((code && MESSAGES[code]) ?? fallback);
  }
  throw error;
}
