import {
  FileTextIcon,
  LayoutTemplateIcon,
  TagsIcon,
  UserCogIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNav = {
  landing: { label: "Landing page", href: "/admin/landing", icon: LayoutTemplateIcon },
  blog: { label: "Blog", href: "/admin/blog", icon: FileTextIcon },
  categories: { label: "Categorias", href: "/admin/categorias", icon: TagsIcon },
  // Visível apenas para superadmin (a página também verifica no servidor).
  users: { label: "Colaboradores", href: "/admin/colaboradores", icon: UsersIcon },
  account: { label: "Minha conta", href: "/admin/conta", icon: UserCogIcon },
} satisfies Record<string, AdminNavItem>;

export type AdminNavId = keyof typeof adminNav;

export const editorialNavIds: AdminNavId[] = ["landing", "blog", "categories"];
