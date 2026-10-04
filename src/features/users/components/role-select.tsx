"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN_ROLES, ROLE_LABELS } from "@/features/auth/roles";

type RoleSelectProps = {
  id?: string;
  value: string;
  onValueChange: (role: string) => void;
  disabled?: boolean;
  size?: "sm" | "default";
};

export function RoleSelect({ id, value, onValueChange, disabled, size }: RoleSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id} size={size} aria-label="Perfil de acesso" className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ADMIN_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
