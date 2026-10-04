"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setUserRole } from "../actions";
import { RoleSelect } from "./role-select";

export function UserRoleCell({ userId, role, disabled }: { userId: string; role: string; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <RoleSelect
      size="sm"
      value={role}
      disabled={disabled || isPending}
      onValueChange={(nextRole) =>
        startTransition(async () => {
          const result = await setUserRole(userId, nextRole);
          if (result.ok) toast.success(result.message);
          else toast.error(result.message);
        })
      }
    />
  );
}
