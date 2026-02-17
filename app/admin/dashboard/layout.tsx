// src/app/admin/dashboard/layout.tsx
import { logoutAdmin } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server Action para Logout
  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-blue-500" />
            Admin Pro
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gestão de Loja</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Pedidos
          </Link>
          <Link
            href="/admin/dashboard/products"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Package className="w-5 h-5" />
            Produtos
          </Link>
          <Link
            href="/admin/dashboard/categories"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
            Categorias
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={handleLogout}>
            <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 md:ml-64 p-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
