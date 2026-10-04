"use client";

import { BanIcon, KeyRoundIcon, LockOpenIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PASSWORD_MIN_LENGTH } from "@/features/auth/schemas";
import type { ActionResult } from "@/lib/action-result";
import { removeUser, setUserBanned, setUserPassword } from "../actions";
import type { UserListItem } from "../queries";

type OpenDialog = "password" | "ban" | "remove" | null;

export function UserActions({ user }: { user: Pick<UserListItem, "id" | "name" | "banned"> }) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      setOpenDialog(null);
    });
  }

  const close = (open: boolean) => !open && setOpenDialog(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost" aria-label={`Ações para ${user.name}`} disabled={isPending}>
            {isPending ? <Spinner /> : <MoreHorizontalIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setOpenDialog("password")}>
              <KeyRoundIcon />
              Redefinir senha
            </DropdownMenuItem>
            {user.banned ? (
              <DropdownMenuItem onSelect={() => run(() => setUserBanned(user.id, false))}>
                <LockOpenIcon />
                Desbloquear
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={() => setOpenDialog("ban")}>
                <BanIcon />
                Bloquear acesso
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onSelect={() => setOpenDialog("remove")}>
              <Trash2Icon />
              Excluir conta
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResetPasswordDialog userId={user.id} name={user.name} open={openDialog === "password"} onOpenChange={close} />

      <AlertDialog open={openDialog === "ban"} onOpenChange={close}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquear {user.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              As sessões ativas são encerradas e a pessoa não consegue mais entrar até ser desbloqueada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => run(() => setUserBanned(user.id, true))}>
              Bloquear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDialog === "remove"} onOpenChange={close}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir a conta de {user.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              A conta é removida definitivamente. Os posts dessa pessoa continuam publicados, sem autor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => run(() => removeUser(user.id))}>
              Excluir conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

type ResetPasswordDialogProps = {
  userId: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ResetPasswordDialog({ userId, name, open, onOpenChange }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await setUserPassword(userId, password);
      if (!result.ok) {
        setError(result.fieldErrors?.password ?? result.message);
        return;
      }
      toast.success(result.message);
      setPassword("");
      onOpenChange(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setPassword("");
          setError(undefined);
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>Defina uma nova senha para {name}.</DialogDescription>
          </DialogHeader>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`password-${userId}`}>Nova senha</FieldLabel>
            <Input
              id={`password-${userId}`}
              type="password"
              autoComplete="new-password"
              value={password}
              aria-invalid={Boolean(error)}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <FieldError>{error}</FieldError> : <FieldDescription>Pelo menos {PASSWORD_MIN_LENGTH} caracteres.</FieldDescription>}
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Redefinir senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
