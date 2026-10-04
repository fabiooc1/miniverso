import type { Metadata } from "next";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel Miniverso" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="flex items-center gap-2 border-b px-4 py-2 md:hidden">
          <SidebarTrigger />
          <span className="text-sm font-semibold">Painel Miniverso</span>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
