import { z } from "zod";
import { ADMIN_ROLES } from "./roles";

export const PASSWORD_MIN_LENGTH = 8;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`)
  .max(128, "Use no máximo 128 caracteres.");

export const nameSchema = z.string().trim().min(1, "Informe o nome.").max(80, "Use no máximo 80 caracteres.");

export const roleSchema = z.enum(ADMIN_ROLES, "Perfil inválido.");
