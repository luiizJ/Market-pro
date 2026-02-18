import { logoutAdmin } from "@/app/actions/auth";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { NavLinks } from "./components/nav-links";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* HEADER MOBILE (Visível apenas em mobile) */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-20">
        <h2 className="font-bold flex items-center gap-2">
          <LayoutDashboard className="text-blue-500 w-5 h-5" />
          Admin Pro
        </h2>

        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-slate-800 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-slate-900 text-white border-slate-800 p-0 w-72"
          >
            <SheetHeader className="p-6 border-b border-slate-800 text-left">
              <SheetTitle className="text-white flex items-center gap-2">
                <LayoutDashboard className="text-blue-500" /> Admin Pro
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-[calc(100vh-80px)]">
              <NavLinks />
              <div className="p-4 border-t border-slate-800 mt-auto">
                <form action={handleLogout}>
                  <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" /> Sair
                  </button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* SIDEBAR DESKTOP (Escondida em mobile) */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-blue-500" />
            Admin Pro
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gestão de Loja</p>
        </div>

        <NavLinks />

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
      <main className="flex-1 md:ml-64 p-4 md:p-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
