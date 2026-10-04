import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, getInitials } from "@/lib/format";
import type { UserListItem } from "../queries";
import { UserActions } from "./user-actions";
import { UserRoleCell } from "./user-role-cell";

export function UsersTable({ users, currentUserId }: { users: UserListItem[]; currentUserId: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 text-xs uppercase">Colaborador</TableHead>
            <TableHead className="text-xs uppercase">Perfil</TableHead>
            <TableHead className="text-xs uppercase">Status</TableHead>
            <TableHead className="text-xs uppercase">Desde</TableHead>
            <TableHead className="pr-6 text-right text-xs uppercase">
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            return (
              <TableRow key={user.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {user.name}
                        {isCurrentUser && <span className="font-normal text-muted-foreground"> (você)</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <UserRoleCell userId={user.id} role={user.role} disabled={isCurrentUser} />
                </TableCell>
                <TableCell>
                  {user.banned ? <Badge variant="destructive">Bloqueado</Badge> : <Badge variant="success">Ativo</Badge>}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="pr-6 text-right">
                  {!isCurrentUser && <UserActions user={user} />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
